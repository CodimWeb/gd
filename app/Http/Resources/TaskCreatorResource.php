<?php

namespace App\Http\Resources;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Task
 */
class TaskCreatorResource extends JsonResource
{
    public function toArray($request): array
    {
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
            'user' => ($this->user_id) ? new UserResource(User::find($this->user_id)) : null,
            'updated_by' => $this->updated_by,
            'updater' => ($this->updated_by) ? new UserResource(User::find($this->updated_by)) : null,
            'created_at' => $this->created_at,
            'offers' => OfferResource::collection($this->offers),
        ];
    }
}
