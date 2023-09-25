<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseRequest;

class ResetPasswordRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @OA\RequestBody(
     *     request="ResetPasswordRequest", required=true,
     *     description="Reset user password request.",
     *     @OA\MediaType(
     *         mediaType="application/x-www-form-urlencoded",
     *         @OA\Schema(
     *              type="object",
     *              @OA\Property(
     *                  property="token", type="string", example="jhkl31xfdc34g1fds5g1351gdf351dfg",
     *                  description="The token."
     *              ),
     *              @OA\Property(
     *                  property="email", type="string", example="user@email.com",
     *                  description="The user email."
     *              ),
     *             @OA\Property(
     *                  property="password", type="string", example="123456",
     *                  format="password",
     *                  description="The user new password."
     *              ),
     *              @OA\Property(
     *                  property="password_confirmation", type="string", example="123456",
     *                  format="password",
     *                  description="The user new password confirmation."
     *              ),
     *              required={"token", "email", "password", "password_confirmation"}
     *         )
     *     )
     * )
     *
     */
    public function rules(): array
    {
        return [
            'token' => 'required',
            'email' => 'required|email|exists:users',
            'password' => 'required|min:6|confirmed',
        ];
    }
}
