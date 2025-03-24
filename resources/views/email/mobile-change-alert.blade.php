<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Security Alert: Mobile Number Updated</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .header {
            font-size: 18px;
            font-weight: bold;
            color: #d9534f;
        }
        .details {
            margin-top: 20px;
        }
        .details p {
            margin: 5px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
        .footer a {
            color: #337ab7;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        .email-button {
            display: inline-block;
            background-color: #252941;
            color: #ffffff !important;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Security Alert: Mobile Number Updated
        </div>
        <p>Hi {{ $userName }},</p>
        <p>Your mobile number has been updated to <strong>{{ $newMobileNumber }}</strong>. If this wasn't you, we're here to help you take some simple steps to secure your account.</p>

        <div class="details">
            <p><strong>Details:</strong></p>
            <li><strong>Location:</strong> {{ $location }}</li>
            <li><strong>Device:</strong> {{ $device }} ({{ $platform }})</li>
            <li><strong>Browser:</strong> {{ $browser }}</li>
        </div>

        <a href="{{ $passwordResetLink }}" class="email-button">This wasn't me</a>
        @include('email.footer')
    </div>
</body>
</html>
