<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseRequest;

class LoginRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @OA\RequestBody(
     *     request="LoginRequest", required=true,
     *     description="Login users.",
     *     @OA\MediaType(
     *         mediaType="application/x-www-form-urlencoded",
     *         @OA\Schema(
     *              type="object",
     *              @OA\Property(
     *                  property="email", type="string", format="email", example="user@email.com",
     *                  description="The user email."
     *              ),
     *             @OA\Property(
     *                  property="password", type="string", example="123456",
     *                  description="The user password."
     *              ),
     *              required={"email","password"}
     *         )
     *     )
     * )
     *
     */
    public function rules(): array
    {
        return [
            'email' => 'required|email|exists:users',
            'password' => 'required|string',
        ];
    }
}
