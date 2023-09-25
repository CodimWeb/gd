<?php

namespace App\Http\Requests\Task;

use App\Http\Requests\BaseRequest;

class TaskRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @OA\RequestBody(
     *     request="TaskRequest", required=true,
     *     description="Create new task.",
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
     *              required={"name", "description"}
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
            'logo' => 'nullable|string',
        ];
    }
}
