<?php
namespace App\Controller\Api;

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
     * @param Request $request
     * @return array
     */
    public function submitAction(Request $request)
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

            return $this->anomo->post('userPicture', [], $body);
        } else {
            $body = $this->getRequired($request->json->all(), [
                'ProfileStatus',
                'IsAnonymous',
                'TopicID'
            ]);

            return $this->anomo->post('userStatus', [], $body);
        }
    }

    /**
     * @Route("/polls/{pollID}/{answerID}", name="polls_answer", methods={"PUT"})
     *
     * @param int $pollID
     * @param int $answerID
     * @return array
     */
    public function answerPollAction($pollID, $answerID)
    {
        return $this->anomo->get('activityAnswerPoll', [
            'pollID'   => $pollID,
            'answerID' => $answerID
        ]);
    }

    /**
     * @Route("/{activityID}", name="delete", methods={"DELETE"})
     *
     * @param int $activityID
     * @return array
     */
    public function deleteAction($activityID)
    {
        return $this->anomo->get('activityDelete', [
            'activityID' => $activityID
        ]);
    }

    /**
     * @Route("/{refID}/{actionType}", name="fetch", methods={"GET"})
     *
     * @param int $refID
     * @param int $actionType
     * @return array
     */
    public function fetchAction($refID, $actionType)
    {
        return $this->anomo->get('activity', [
            'refID'      => $refID,
            'actionType' => $actionType
        ]);
    }

    /**
     * @Route("/{refID}/{actionType}/likes", name="likes", methods={"GET"})
     *
     * @param int $refID
     * @param int $actionType
     * @return array
     */
    public function likesAction($refID, $actionType)
    {
        return $this->anomo->get('activityLikeList', [
            'refID'      => $refID,
            'actionType' => $actionType
        ]);
    }

    /**
     * @Route("/{refID}/{actionType}/likes", name="like", methods={"PUT"})
     *
     * @param int $refID
     * @param int $actionType
     * @return array
     */
    public function likeAction($refID, $actionType)
    {
        return $this->anomo->get('activityLike', [
            'refID'      => $refID,
            'actionType' => $actionType
        ]);
    }

    /**
     * @Route("/{refID}/{actionType}/notifications", name="stop_notify", methods={"PUT"})
     *
     * @param int $refID
     * @param int $actionType
     * @return array
     */
    public function notificationsAction($refID, $actionType)
    {
        return $this->anomo->get('commentStopNotify', [
            'refID'      => $refID,
            'actionType' => $actionType
        ]);
    }
}
