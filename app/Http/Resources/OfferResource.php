<?php

namespace App\Http\Resources;

use App\Models\User;
use App\Models\Offer;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Offer
 */
class OfferResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'task_id' => $this->task_id,
            'status' => $this->status,
            'user' => ($this->user_id) ? new UserResource(User::find($this->user_id)) : null,
            'created_at' => $this->created_at,
        ];
    }
}
