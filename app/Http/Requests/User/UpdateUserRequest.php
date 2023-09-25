<?php

namespace App\Http\Requests\User;

use App\Http\Requests\BaseRequest;

class UpdateUserRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @OA\RequestBody(
     *     request="UpdateUserRequest", required=true,
     *     description="Update user info.",
     *     @OA\MediaType(
     *         mediaType="application/x-www-form-urlencoded",
     *         @OA\Schema(
     *              type="object",
     *              @OA\Property(
     *                  property="username", type="string", format="string", example="test",
     *                  description="The user username."
     *              ),
     *             @OA\Property(
     *                  property="biography", type="string", format="string", example="test",
     *                  description="The user biography."
     *              ),
     *             @OA\Property(
     *                  property="country_id", type="integer", format="integer", example="1",
     *                  description="The user country id."
     *              ),
     *              required={"username"}
     *         )
     *     )
     * )
     *
     */
    public function rules(): array
    {
        return [
            'username' => 'required|string',
            'biography' => 'nullable|string',
            'country_id' => 'nullable|integer|exists:countries,id',
        ];
    }
}
