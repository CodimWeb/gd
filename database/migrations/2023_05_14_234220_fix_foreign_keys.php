<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->foreign('category_id')->references('id')->on('task_categories')
                ->nullOnDelete()->cascadeOnUpdate();

            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users')
                ->nullOnDelete()->cascadeOnUpdate();

            $table->dropForeign(['updated_by']);
            $table->foreign('updated_by')->references('id')->on('users')
                ->nullOnDelete()->cascadeOnUpdate();
        });

        Schema::table('offers', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users')
                ->cascadeOnDelete()->cascadeOnUpdate();

            $table->dropForeign(['task_id']);
            $table->foreign('task_id')->references('id')->on('tasks')
                ->cascadeOnDelete()->cascadeOnUpdate();
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users')
                ->cascadeOnDelete()->cascadeOnUpdate();
        });

        Schema::table('chats', function (Blueprint $table) {
            $table->dropForeign(['user_one']);
            $table->foreign('user_one')->references('id')->on('users')
                ->cascadeOnDelete()->cascadeOnUpdate();

            $table->dropForeign(['user_two']);
            $table->foreign('user_two')->references('id')->on('users')
                ->cascadeOnDelete()->cascadeOnUpdate();

            $table->dropForeign(['task_id']);
            $table->foreign('task_id')->references('id')->on('tasks')
                ->cascadeOnDelete()->cascadeOnUpdate();
        });

        Schema::table('chat_messages', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users')
                ->cascadeOnDelete()->cascadeOnUpdate();

            $table->dropForeign(['chat_id']);
            $table->foreign('chat_id')->references('id')->on('chats')
                ->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.K
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->foreign('category_id')->references('id')->on('task_categories');

            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users');

            $table->dropForeign(['updated_by']);
            $table->foreign('updated_by')->references('id')->on('users');
        });

        Schema::table('offers', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users');

            $table->dropForeign(['task_id']);
            $table->foreign('task_id')->references('id')->on('tasks');
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users');
        });

        Schema::table('chats', function (Blueprint $table) {
            $table->dropForeign(['user_one']);
            $table->foreign('user_one')->references('id')->on('users');

            $table->dropForeign(['user_two']);
            $table->foreign('user_two')->references('id')->on('users');

            $table->dropForeign(['task_id']);
            $table->foreign('task_id')->references('id')->on('tasks');
        });

        Schema::table('chat_messages', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users');

            $table->dropForeign(['chat_id']);
            $table->foreign('chat_id')->references('id')->on('chats');
        });
    }
};
