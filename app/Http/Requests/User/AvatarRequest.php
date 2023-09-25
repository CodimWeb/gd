<?php

namespace App\Http\Requests\User;

use App\Http\Requests\BaseRequest;

class AvatarRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @OA\RequestBody(
     *     request="AvatarRequest", required=true,
     *     description="Set avatar password request.",
     *     @OA\MediaType(
     *         mediaType="multipart/form-data",
     *         @OA\Schema(
     *              type="object",
     *              @OA\Property(
     *                  property="avatar", type="string",
     *                  description="New user avatar in base64 format."
     *              ),
     *              required={"avatar"}
     *         )
     *     )
     * )
     *
     */
    public function rules(): array
    {
        return [
            'avatar' => 'required|string',
        ];
    }
}
