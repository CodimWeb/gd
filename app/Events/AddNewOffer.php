<?php

namespace App\Events;

use App\Models\User;
use App\Models\Offer;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

class AddNewOffer
{
    use Dispatchable;
    use SerializesModels;
    use InteractsWithSockets;

    public User $user;
    public Offer $offer;

    public function __construct(User $user, Offer $offer)
    {
        $this->user = $user;
        $this->offer = $offer;
    }
}
