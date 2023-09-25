<?php

namespace App\Listeners;

use App\Events\AcceptOffer;
use App\Models\Notification;

class SendAcceptedOfferNotification
{
    public function handle(AcceptOffer $event): void
    {
        $offer = $event->offer;

        Notification::create([
            'user_id' => $offer->user_id,
            'type' => Notification::TYPE_OFFER_ACCEPTED,
            'message' => __('Вас выбрали в качестве исполнителя для задания ' . $offer->task->name),
            'message_en' => __('You have been selected as the performer for the task ' . $offer->task->name),
            'params' => json_encode(['task_id' => $offer->task_id])
        ]);

        Notification::create([
            'user_id' => $offer->task->user_id,
            'type' => Notification::TYPE_OFFER_ACCEPTED,
            'message' => __('Вы выбрали в качестве исполнителя для задания ' .
                $offer->task->name .
                ' пользователя ' .
                $offer->user->username
            ),
            'message_en' => __('You have chosen user ' .
                $offer->user->username .
                ' as the performer for task ' .
                $offer->task->name
            ),
            'params' => json_encode(['task_id' => $offer->task_id, 'user_id' => $offer->user_id])
        ]);
    }
}
