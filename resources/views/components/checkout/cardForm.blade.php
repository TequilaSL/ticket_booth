<form action="http://ticketbooth.tequilasl.com/cardConfirmTest/{{ $transaction_id }}/{{ $total }}" method="get" id="creditCardForm" onsubmit="handleFormSubmit(event)>
    <input name="PurchaseDesc" type="hidden" value="{{ $transaction_id }}">
    <input name="PurchaseAmt" type="hidden" value="{{ $total }}">
    <input name="CountryCode" type="hidden" value="268">
    <input name="CurrencyCode" type="hidden" value="{{ $current_currency_code }}">
    <input name="MerchantName" type="hidden" value="Zoombus">
    <input name="MerchantURL" type="hidden" value="https://zoombus.net">
    <input name="MerchantCity" type="hidden" value="Tbilisi">
    <input name="MerchantID" type="hidden" value="000000008000123-00000001">
    <input name="xDDDSProxy.Language" type="hidden" value="{{ $current_locale_id }}">
</form>
