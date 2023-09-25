<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseRequest;

class RegisterRequest extends BaseRequest
{
    /**
     * @OA\RequestBody(
     *     request="RegisterRequest", required=true,
     *     description="Register users.",
     *     @OA\MediaType(
     *         mediaType="application/x-www-form-urlencoded",
     *         @OA\Schema(
     *              type="object",
     *              @OA\Property(
     *                  property="email", type="string", example="user@email.com",
     *                  description="The user email."
     *              ),
     *              @OA\Property(
     *                  property="username", type="string", example="username",
     *                  description="The username."
     *              ),
     *            @OA\Property(
     *                  property="birthday", type="string", example="2000-01-01",
     *                  description="The user birthday."
     *              ),
     *             @OA\Property(
     *                  property="password", type="string", example="123456",
     *                  format="password",
     *                  description="The user password."
     *              ),
     *              @OA\Property(
     *                  property="password_confirmation", type="string", example="123456",
     *                  format="password",
     *                  description="The user password confirmation."
     *              ),
     *              required={"email", "username", "birthday", "password", "password_confirmation"}
     *         )
     *     )
     * )
     */
    public function rules(): array
    {
        return [
            'email' => 'required|email|unique:users,email',
            'username' => 'required|max:255',
            'birthday' => 'required|date',
            'password' => 'required|confirmed|min:6',
            'password_confirmation' => 'required',
        ];
    }
}
