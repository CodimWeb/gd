<?php

namespace App\Http\Requests\User;

use App\Http\Requests\BaseRequest;

class ChangePasswordRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @OA\RequestBody(
     *     request="ChangePasswordRequest", required=true,
     *     description="Change user password request.",
     *     @OA\MediaType(
     *         mediaType="application/x-www-form-urlencoded",
     *         @OA\Schema(
     *              type="object",
     *              @OA\Property(
     *                  property="password", type="string", example="123456",
     *                  format="password",
     *                  description="The user old password."
     *              ),
     *             @OA\Property(
     *                  property="new_password", type="string", example="12345678",
     *                  format="password",
     *                  description="The user new password."
     *              ),
     *              @OA\Property(
     *                  property="new_password_confirmation", type="string", example="12345678",
     *                  format="password",
     *                  description="The user new password confirmation."
     *              ),
     *              required={"password", "new_password", "new_password_confirmation"}
     *         )
     *     )
     * )
     *
     */
    public function rules(): array
    {
        return [
            'password' => 'required',
            'new_password' => 'required|min:6|different:password|confirmed',
        ];
    }
}
