<?php

namespace App\Http\Controllers;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Illuminate\Support\Facades\Log;

class MailController extends Controller
{
    public function sendMail($values)
    {
        $mail = new PHPMailer(true);
        try {
            //Server settings
            $mail->SMTPDebug = 0;
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'nipuna315np@gmail.com';
            $mail->Password   = 'yjxksqhweaazqdma';
            $mail->SMTPSecure = 'ssl';
            $mail->Port       = 465;

            if (is_array($values['email'])) {
                Log::info("1");
                $email=$values['email'][0];
               
                Log::info($email);
                $mail->setFrom('nipuna315np@gmail.com', 'piyumal');
                $mail->addAddress($email, 'nipuna');
            } else {
                Log::info("2");
               
                $email=$values['email'];
                Log::info($email);
                $mail->setFrom('nipuna315np@gmail.com', 'piyumal');
                $mail->addAddress($email, 'nipuna');
            }
     
            //Content
            $mail->isHTML(true);
            $mail->Subject = 'booking ticket !';
            $mail->Body    = '<b>I hereby inform you that you have booked a bus ticket through our website.</b>';
            $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';
            $mail->send();
            Log::info("sent");
        } catch (Exception $e) {
            Log::info("error : ",$e->getMessage());
            echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo} , ";
        }
    }
}
