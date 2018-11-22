<?php
namespace App\Controller\Api;

use App\Anomo\Anomo;
use App\Http\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route(
 *     "/users",
 *     name="api_users_",
 *     options={"expose"=true},
 *     defaults={"page": 1},
 *     requirements={"userID": "\d+", "page": "\d+"}
 * )
 */
class UsersController extends Controller
{
    /**
     * @Route("/{userID}", name="fetch", methods={"GET"})
     *
     * @param Anomo $anomo
     * @param int $userID
     * @return array
     */
    public function fetchAction(Anomo $anomo, $userID)
    {
        return $anomo->get('user', [
            'userID' => $userID
        ]);
    }

    /**
     * @Route("/login", name="login", methods={"POST"})
     *
     * @param Anomo $anomo
     * @param Request $request
     * @return array
     */
    public function loginAction(Anomo $anomo, Request $request)
    {
        $body = $this->getRequired($request->json->all(), [
            'UserName',
            'Password'
        ]);

        return $anomo->post('userLogin', [], [
            'UserName' => $body['UserName'],
            'Password' => md5($body['Password'])
        ]);
    }

    /**
     * @Route("/login/facebook", name="login_facebook", methods={"POST"})
     *
     * @param Anomo $anomo
     * @param Request $request
     * @return array
     */
    public function facebookLoginAction(Anomo $anomo, Request $request)
    {
        $body = $this->getRequired($request->json->all(), [
            'Email',
            'FacebookID',
            'FbAccessToken'
        ]);

        return $anomo->post('userFBLogin', [], $body);
    }

    /**
     * @Route("/logout", name="logout", methods={"POST"})
     *
     * @param Anomo $anomo
     * @return array
     */
    public function logoutAction(Anomo $anomo)
    {
        return $anomo->post('userLogout');
    }

    /**
     * @Route("/{userID}/following/{page}", name="following", methods={"GET"})
     *
     * @param Anomo $anomo
     * @param int $userID
     * @return array
     */
    public function followingAction(Anomo $anomo, $userID, $page)
    {
        return $anomo->get('userFollowing', [
            'userID' => $userID,
            'page'   => $page
        ]);
    }

    /**
     * @Route("/{userID}/followers/{page}", name="followers", methods={"GET"})
     *
     * @param Anomo $anomo
     * @param int $userID
     * @return array
     */
    public function followersAction(Anomo $anomo, $userID, $page)
    {
        return $anomo->get('userFollowers', [
            'userID' => $userID,
            'page'   => $page
        ]);
    }

    /**
     * @Route("/{userID}/followers", name="follow", methods={"PUT"})
     *
     * @param Anomo $anomo
     * @param int $userID
     * @return array
     */
    public function followAction(Anomo $anomo, $userID)
    {
        return $anomo->get('userFollow', [
            'userID' => $userID
        ]);
    }
}
