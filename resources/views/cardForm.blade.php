<script>
    function fetchQRCode(transactionId, total) {
        fetch(`http://127.0.0.1:8000/cardConfirmTest/${transactionId}/${total}`)
            .then(response => response.json())
            .then(data => {
                if (data.qrCodeUrl) {
                    alert('QR Code URL: ' + data.qrCodeUrl);
                } else {
                    alert('Error: ' + (data.error || 'Unknown error occurred'));
                }
            })
            .catch(error => {
                alert('An error occurred while fetching the QR code.');
                console.error(error);
            });
    }

    fetchQRCode(123, 500);
</script>
