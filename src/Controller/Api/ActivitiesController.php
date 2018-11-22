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
        /** @var UploadedFile[] $files */
        $files = $request->files->all();
        if ($files) {
            $body = [];

            foreach($files as $fieldName => $file) {
                $body['multipart'] = [
                    [
                        'name'     => $fieldName,
                        'filename' => $file->getClientOriginalName(),
                        'contents' => fopen($file->getPathname(), 'r'),
                        'headers'  => [
                            'Content-Type' => $file->getClientMimeType()
                        ]
                    ]
                ];
            }
            foreach($request->request->all() as $fieldName => $contents) {
                $body['multipart'][] = [
                    'name'     => $fieldName,
                    'contents' => $contents
                ];
            }

            return $anomo->post('userPicture', [], $body);
        } else {
            $body = $this->getRequired($request->json->all(), [
                'ProfileStatus',
                'IsAnonymous',
                'TopicID'
            ]);

            return $anomo->post('userStatus', [], $body);
        }
    }

    /**
     * @Route("/polls/{pollID}/{answerID}", name="polls_answer", methods={"PUT"})
     *
     * @param Anomo $anomo
     * @param int $pollID
     * @param int $answerID
     * @return array
     */
    public function answerPollAction(Anomo $anomo, $pollID, $answerID)
    {
        return $anomo->get('activityAnswerPoll', [
            'pollID'   => $pollID,
            'answerID' => $answerID
        ]);
    }

    /**
     * @Route("/{activityID}", name="delete", methods={"DELETE"})
     *
     * @param Anomo $anomo
     * @param int $activityID
     * @return array
     */
    public function deleteAction(Anomo $anomo, $activityID)
    {
        return $anomo->get('activityDelete', [
            'activityID' => $activityID
        ]);
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

    /**
     * @Route("/{refID}/{actionType}/likes", name="like", methods={"PUT"})
     *
     * @param Anomo $anomo
     * @param int $refID
     * @param int $actionType
     * @return array
     */
    public function likeAction(Anomo $anomo, $refID, $actionType)
    {
        return $anomo->get('activityLike', [
            'refID'      => $refID,
            'actionType' => $actionType
        ]);
    }

    /**
     * @Route("/{refID}/{actionType}/notifications", name="stop_notify", methods={"PUT"})
     *
     * @param Anomo $anomo
     * @param int $refID
     * @param int $actionType
     * @return array
     */
    public function notificationsAction(Anomo $anomo, $refID, $actionType)
    {
        return $anomo->get('commentStopNotify', [
            'refID'      => $refID,
            'actionType' => $actionType
        ]);
    }
}
