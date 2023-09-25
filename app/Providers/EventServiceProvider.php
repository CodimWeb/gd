<?php

namespace App\Providers;

use App\Events\DoneTask;
use App\Events\AddNewChat;
use App\Events\AcceptOffer;
use App\Events\AddNewOffer;
use App\Events\RejectOffer;
use App\Listeners\CreateNewChat;
use Illuminate\Auth\Events\Registered;
use App\Listeners\SendNewOfferNotification;
use App\Listeners\SendDoneTaskNotification;
use App\Listeners\SendAcceptedOfferNotification;
use App\Listeners\SendRejectedOfferNotification;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        AddNewOffer::class => [
            SendNewOfferNotification::class,
        ],
        AddNewChat::class => [
            CreateNewChat::class,
        ],
        AcceptOffer::class => [
            SendAcceptedOfferNotification::class,
        ],
        RejectOffer::class => [
            SendRejectedOfferNotification::class,
        ],
        DoneTask::class => [
            SendDoneTaskNotification::class,
        ],
    ];

    public function boot(): void
    {
        //
    }

    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
