<?php

namespace App\Http\Requests\Task;

use App\Http\Requests\BaseRequest;
use App\Models\Offer;
use App\Models\Task;
use Illuminate\Validation\Rule;

class OfferStatusRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @OA\RequestBody(
     *     request="OfferStatusRequest", required=true,
     *     description="Change offer status.",
     *     @OA\MediaType(
     *         mediaType="application/x-www-form-urlencoded",
     *         @OA\Schema(
     *              type="object",
     *              @OA\Property(
     *                  property="status", type="string", example="accepted",
     *                  enum={"new", "accepted", "rejected"}
     *              ),
     *              required={"status"}
     *         )
     *     )
     * )
     *
     */
    public function rules(): array
    {
        return [
            'status' => [
                'required',
                'string',
                Rule::in(Offer::allStatuses()),
            ],
        ];
    }
}
