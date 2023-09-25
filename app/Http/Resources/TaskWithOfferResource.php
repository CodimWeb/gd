<?php

namespace App\Http\Resources;

use App\Models\Task;
use App\Models\User;
use App\Models\Offer;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Task
 */
class TaskWithOfferResource extends JsonResource
{
    public function toArray($request): array
    {
        if (!empty($this->user_id) && $user = User::find($this->user_id)) {
            $userData = [
                'id' => $user->id,
                'username' => $user->username,
                'avatar' => $user->avatar,
                'created_at' => $user->created_at,
            ];
        }

        $acceptedOffer = Offer::whereTaskId($this->id)->whereStatus(Offer::STATUS_ACCEPTED)->first();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'status' => $this->status,
            'status_text' => $this->status_text,
            'description' => $this->description,
            'category_id' => $this->category_id,
            'category' => ($this->category_id) ? $this->category?->name : null,
            'category_en' => ($this->category_id) ? $this->category?->name_en : null,
            'logo' => $this->logo,
            'user_id' => $this->user_id,
            'user' => ($this->user_id) ? $userData ?? [] : null,
            'accepted_offer' => (!empty($acceptedOffer)) ? new OfferResource($acceptedOffer) : NULL,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at,
        ];
    }
}
