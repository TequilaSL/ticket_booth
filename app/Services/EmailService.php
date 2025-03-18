<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use App\Helpers\LogHelper;
use Exception;

class EmailService
{
    /**
     * Send an email.
     *
     * @param string $to Recipient email address
     * @param string $subject Email subject
     * @param string $view Blade view for the email content
     * @param array $data Data to pass to the view
     * @param array $attachments (Optional) Array of file paths to attach
     * @param array $cc (Optional) Array of CC email addresses
     * @param array $bcc (Optional) Array of BCC email addresses
     * @return array
     * @throws Exception
     */
    public function sendEmail(
        string $to,
        string $subject,
        string $view,
        array $data = [],
        array $attachments = [],
        array $cc = [],
        array $bcc = []
    ): array {
        try {
            Mail::send($view, $data, function ($message) use ($to, $subject, $attachments, $cc, $bcc) {
                $message->to($to)
                        ->subject($subject)
                        ->from(config('mail.from.address'), config('mail.from.name'));

                // Attach files if provided
                foreach ($attachments as $attachment) {
                    $message->attach($attachment);
                }

                // Add CC recipients if provided
                if (!empty($cc)) {
                    $message->cc($cc);
                }

                // Add BCC recipients if provided
                if (!empty($bcc)) {
                    $message->bcc($bcc);
                }
            });

            // LogHelper::info('Email sent successfully', [
            //     'to' => $to,
            //     'subject' => $subject
            // ]);

            return ['status' => 1, 'text' => 'Email sent successfully'];
        } catch (Exception $e) {
            LogHelper::apiCallError("Mail Service Error: ", $e->getCode(), $e->getMessage());
            throw $e;
        }
    }
}
