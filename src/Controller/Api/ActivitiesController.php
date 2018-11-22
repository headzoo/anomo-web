<?php
namespace App\Controller\Api;

use App\Anomo\Anomo;
use App\Http\Request;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route(
 *     "/activities",
 *     name="api_activities_",
 *     options={"expose"=true},
 *     requirements={"refID": "\d+", "actionType": "\d+"}
 * )
 */
class ActivitiesController extends Controller
{
    /**
     * @Route("", name="submit", methods={"POST"})
     *
     * @param Anomo $anomo
     * @param Request $request
     * @return array
     */
    public function submitAction(Anomo $anomo, Request $request)
    {
        /** @var UploadedFile $photo */
        $photo = $request->files->get('Photo');
        if ($photo) {
            $post = $request->request->all();
            $body = [];
            $body['multipart'] = [
                [
                    'name'     => 'Photo',
                    'filename' => $photo->getClientOriginalName(),
                    'contents' => fopen($photo->getPathname(), 'r'),
                    'headers'  => [
                        'Content-Type' => $photo->getClientMimeType()
                    ]
                ]
            ];

            $video = $request->files->get('Video');
            if ($video) {
                $body['multipart'][] = [
                    'name'     => 'Video',
                    'filename' => $video->getClientOriginalName(),
                    'contents' => fopen($video->getPathname(), 'r'),
                    'headers'  => [
                        'Content-Type' => $video->getClientMimeType()
                    ]
                ];
            }

            foreach($post as $name => $contents) {
                $body['multipart'][] = [
                    'name'     => $name,
                    'contents' => $contents
                ];
            }
        } else {
            $body = $this->getRequired($request->json->all(), [
                'ProfileStatus',
                'IsAnonymous',
                'TopicID'
            ]);
        }

        return $anomo->post('userStatus', [], $body);
    }

    /**
     * @Route("/{refID}/{actionType}", name="fetch", methods={"GET"})
     *
     * @param Anomo $anomo
     * @param int $refID
     * @param int $actionType
     * @return array
     */
    public function fetchAction(Anomo $anomo, $refID, $actionType)
    {
        return $anomo->get('activity', [
            'refID'      => $refID,
            'actionType' => $actionType
        ]);
    }

    /**
     * @Route("/{refID}/{actionType}/likes", name="likes", methods={"GET"})
     *
     * @param Anomo $anomo
     * @param int $refID
     * @param int $actionType
     * @return array
     */
    public function likesAction(Anomo $anomo, $refID, $actionType)
    {
        return $anomo->get('activityLikeList', [
            'refID'      => $refID,
            'actionType' => $actionType
        ]);
    }
}
