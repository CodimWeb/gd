<?php

namespace App\Listeners;

use App\Events\AddNewOffer;
use App\Models\Notification;

class SendNewOfferNotification
{
    public function handle(AddNewOffer $event): void
    {
        $user = $event->user;
        $offer = $event->offer;

        Notification::create([
            'user_id' => $user->id,
            'type' => Notification::TYPE_NEW_OFFER,
            'message' => __('Вы откликнулись на задание ' . $offer->task->name),
            'message_en' => __('You responded to task ' . $offer->task->name),
            'params' => json_encode(['task_id' => $offer->task_id])
        ]);

        Notification::create([
            'user_id' => $offer->task->user_id,
            'type' => Notification::TYPE_NEW_OFFER,
            'message' => __('На ваше задание ' .
                $offer->task->name .
                ' откликнулся ' .
                $offer->user->username
            ),
            'message_en' => __($offer->user->username .
                ' responded to your task ' .
                $offer->task->name
            ),
            'params' => json_encode(['task_id' => $offer->task_id, 'user_id' => $offer->user_id])
        ]);
    }
}
