<?php

namespace App\Events;

use App\Models\Offer;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

class AcceptOffer
{
    use Dispatchable;
    use SerializesModels;
    use InteractsWithSockets;

    public Offer $offer;

    public function __construct(Offer $offer)
    {
        $this->offer = $offer;
    }
}
