<?php

namespace App\Listeners;

use App\Events\RejectOffer;
use App\Models\Notification;

class SendRejectedOfferNotification
{
    public function handle(RejectOffer $event): void
    {
        $offer = $event->offer;

        Notification::create([
            'user_id' => $offer->user_id,
            'type' => Notification::TYPE_OFFER_REJECTED,
            'message' => __('Вам отказали в работе по заданию ' . $offer->task->name),
            'message_en' => __('You were rejected work on task ' . $offer->task->name),
            'params' => json_encode(['task_id' => $offer->task_id])
        ]);
    }
}
