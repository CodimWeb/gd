<?php

namespace App\Http\Requests\Task;

use App\Http\Requests\BaseRequest;
use App\Models\Task;
use Illuminate\Validation\Rule;

class TaskEditRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @OA\RequestBody(
     *     request="TaskEditRequest", required=true,
     *     description="Edit task.",
     *     @OA\MediaType(
     *         mediaType="multipart/form-data",
     *         @OA\Schema(
     *              type="object",
     *              @OA\Property(
     *                  property="logo", type="string",
     *                  description="New task logo in base64 format."
     *              ),
     *             @OA\Property(
     *                  property="name", type="string", example="test",
     *                  description="The task name."
     *              ),
     *             @OA\Property(
     *                  property="description", type="string", example="test description",
     *                  description="The task description."
     *              ),
     *             @OA\Property(
     *                  property="category_id", type="integer", example="1",
     *                  description="The task category id."
     *              ),
     *              @OA\Property(
     *                  property="status", type="string", example="closed",
     *                  enum={"waiting", "in progress", "done", "closed", "hidden", "archived"}
     *              ),
     *              required={"name", "description", "status"}
     *         )
     *     )
     * )
     *
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string',
            'description' => 'required|string',
            'category_id' => 'nullable|integer',
            'status' => [
                'required',
                'string',
                Rule::in(Task::allStatuses()),
            ],
            'logo' => 'nullable|file',
        ];
    }
}
