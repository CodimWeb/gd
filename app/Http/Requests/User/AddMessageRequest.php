<?php

namespace App\Http\Requests\User;

use App\Http\Requests\BaseRequest;

class AddMessageRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @OA\RequestBody(
     *     request="AddMessageRequest", required=true,
     *     description="New chat message.",
     *     @OA\MediaType(
     *         mediaType="application/x-www-form-urlencoded",
     *         @OA\Schema(
     *              type="object",
     *              @OA\Property(
     *                  property="message", type="string", example="Test message",
     *                  description="Chat message"
     *              ),
     *              required={"message"}
     *         )
     *     )
     * )
     *
     */
    public function rules(): array
    {
        return [
            'message' => 'required',
        ];
    }
}
