<?php

namespace App;

use Laravel\Passport\Bridge\AccessToken as PassportAccessToken;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Signer\Key;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Rsa\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use League\OAuth2\Server\CryptKey;

class AccessToken extends PassportAccessToken {
    private $privateKey;

    public function __toString() {
        return (string) $this->convertToJWT($this->privateKey);
    }

    public function setPrivateKey(CryptKey $privateKey) {
        $this->privateKey = $privateKey;
    }

    public function convertToJWT(CryptKey $privateKey) {
        $signingKey = InMemory::file($privateKey->getKeyPath(), $privateKey->getPassPhrase() ?? '');
        $verificationKey = InMemory::plainText(file_get_contents($privateKey->getKeyPath()));  // Adjust this if a separate public key is used

        $config = Configuration::forAsymmetricSigner(
            new Sha256(),
            $signingKey,
            $verificationKey
        );

        $now = new \DateTimeImmutable();

        $token = $config->builder()
            ->permittedFor($this->getClient()->getIdentifier())
            ->identifiedBy($this->getIdentifier(), true)
            ->issuedAt($now)
            ->canOnlyBeUsedAfter($now)
            ->expiresAt($this->getExpiryDateTime())
            ->relatedTo($this->getUserIdentifier())
            ->withClaim('scopes', $this->getScopes())
            ->withClaim('roles', $this->getRoles())
            ->getToken($config->signer(), $config->signingKey());

        return $token->toString();
    }

    public function getRoles() {
        $roles = [];
        $isWizard = Driver::whereHas('user')->whereUserId($this->getUserIdentifier())->notActive()->where('step', '<', 5)->exists();
        if($isWizard) {
            $roles[] = 'wizard';
        }

        $isDriver = Driver::whereHas('user')->whereUserId($this->getUserIdentifier())->exists();
        if($isDriver) {
            $roles[] = 'driver';
        }

        $isPartner = Partner::whereHas('user')->whereUserId($this->getUserIdentifier())->exists();
        if($isPartner) {
            $roles[] = 'partner';
        }
        return $roles;
    }

}
