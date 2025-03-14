<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email Address</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
        }
        .email-wrapper {
            background-color: #f4f4f9;
            padding: 20px;
        }
        .email-content {
            max-width: 600px;
            background-color: #ffffff;
            margin: 0 auto;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            text-align: center;
        }
        .email-header {
            font-size: 24px;
            color: #333333;
            margin-bottom: 20px;
        }
        .email-body {
            font-size: 16px;
            color: #555555;
            margin-bottom: 30px;
            line-height: 1.5;
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
        .email-footer {
            font-size: 14px;
            color: #888888;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-content">
            <h1 class="email-header">Verify Your Email Address</h1>
            <p class="email-body">
                Thank you for signing up! To complete your registration, please verify your email address by clicking the button below:
            </p>
            <a href="{{ $verificationLink }}" class="email-button">Verify Email</a>
            <p class="email-body">
                If you did not create an account, no further action is required.
            </p>
            <div class="email-footer">
                © {{ date('Y') }} TicketBooth.lk. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>
