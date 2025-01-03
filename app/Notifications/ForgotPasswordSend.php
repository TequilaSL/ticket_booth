<?php

namespace App\Notifications;


use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\NexmoMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;

class ForgotPasswordSend extends Notification{
    use Queueable;


    public $password;
    public $preferred_language;

    public function __construct($preferred_language, $password) {
        $this->password = $password;
        $this->preferred_language = $preferred_language;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable) {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)->from('no-reply@zoombus.net', 'Zoombus')->subject(
            \Lang::get('email_templates.forgot_password_title', [], $this->preferred_language)
        )->view('email.app',
            [
                'locale' => ($this->preferred_language == 'ka') ? 'language_ge' : null,
                'title' =>
                    \Lang::get('email_templates.forgot_password_title', [], $this->preferred_language),
                'text' =>
                    \Lang::get('notifications.forgot_password', ['password' => $this->password], $this->preferred_language),
            ]
        );
    }


    /**
     * Get the Nexmo SMS representation of the notification.
     *
     * @param mixed $notifiable
     * @return NexmoMessage
     */

    public function toNexmo($notifiable) {
        return (new NexmoMessage())
            ->content(Lang::get('notifications.forgot_password', ['password' => $this->password], $this->preferred_language))->unicode();
    }
}
