<?php

namespace App\Http\Requests\Task;

use App\Http\Requests\BaseRequest;
use App\Models\Task;
use Illuminate\Validation\Rule;

class TaskStatusRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @OA\RequestBody(
     *     request="TaskStatusRequest", required=true,
     *     description="Change task status.",
     *     @OA\MediaType(
     *         mediaType="application/x-www-form-urlencoded",
     *         @OA\Schema(
     *              type="object",
     *              @OA\Property(
     *                  property="status", type="string", example="closed",
     *                  enum={"waiting", "in progress", "done", "closed", "hidden", "archived"}
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
                Rule::in(Task::allStatuses()),
            ],
        ];
    }
}
