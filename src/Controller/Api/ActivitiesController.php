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
        if ($refID === '1433781') {
            $activity = [
                'ActivityID' => '1578597',
                'FromUserID' => '316610',
                'Image' => '',
                'RefID' => '1433781',
                'Type' => '27',
                'ActionType' => '27',
                'CreatedDate' => '2018-11-27 15:38:38',
                'Gender' => '2',
                'BirthDate' => '1985-03-11',
                'NeighborhoodID' => '60296',
                'Mention' => '',
                'Avatar' => 'http://anomo-production1.s3.amazonaws.com/upload/36e8a60dba3c27955d8751c4babb0422.jpg',
                'FromUserName' => 'fornicake',
                'IsFavorite' => '1',
                'Like' => '0',
                'Comment' => '0',
                'EventEndDate' => '',
                'EventLat' => '0',
                'EventLong' => '0',
                'NumberIamGoing' => '0',
                'AmIGoing' => '0',
                'ImageHeight' => 300,
                'ImageWidth' => 200,
                'IsDeleted' => false,
                'DeleteIsSending' => false,
                'LikeIsLoading' => false,
                'LikeList' => [],
                'ListComment' => [],
                'Message' => json_encode([
                    'message' => 'Bye there',
                    'message_tags' => []
                ])
            ];

            return ['Activity' => $activity];
        }
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
