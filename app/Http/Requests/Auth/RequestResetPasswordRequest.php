<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseRequest;

class RequestResetPasswordRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @OA\RequestBody(
     *     request="RequestResetPasswordRequest", required=true,
     *     description="Reset user password request.",
     *     @OA\MediaType(
     *         mediaType="application/x-www-form-urlencoded",
     *         @OA\Schema(
     *              type="object",
     *              @OA\Property(
     *                  property="email", type="string", format="email", example="user@email.com",
     *                  description="The user email."
     *              ),
     *              required={"email"}
     *         )
     *     )
     * )
     *
     */
    public function rules(): array
    {
        return [
            'email' => 'required|email|exists:users',
        ];
    }
}
