<?php

namespace App\Helpers;

use Exception;
use App\Models\Task;
use Illuminate\Support\Carbon;

class ImageHelper
{
    /**
     * @throws Exception
     */
    public static function decodeIncomingBase64(string $encodedLogo): string
    {
        if (preg_match('/^data:image\/(\w+);base64,/', $encodedLogo, $type)) {
            $data = substr($encodedLogo, strpos($encodedLogo, ',') + 1);
            $type = strtolower($type[1]); // jpg, png, gif

            if (!in_array($type, [ 'jpg', 'jpeg', 'gif', 'png' ])) {
                throw new Exception('invalid image type');
            }
            $data = str_replace( ' ', '+', $data );
            $data = base64_decode($data);

            if ($data == false) {
                throw new Exception('base64_decode failed');
            }
        } else {
            throw new Exception('did not match data URI with image data');
        }

        if (!is_dir(Task::LOCAL_LOGO_PATH)) {
            mkdir(Task::LOCAL_LOGO_PATH);
        }

        $logoPath = Task::LOCAL_LOGO_PATH . DIRECTORY_SEPARATOR . Carbon::now()->timestamp . ".$type";
        file_put_contents($logoPath, $data);

        return $logoPath;
    }
}
