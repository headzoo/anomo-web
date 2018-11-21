<?php
namespace App\Controller\Api;

use App\Anomo\Anomo;
use App\Http\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/users", name="api_users_", options={"expose"=true})
 */
class UsersController extends Controller
{
    /**
     * @Route("/anomo/login", name="anomo_login", methods={"POST"})
     *
     * @param Anomo $anomo
     * @param Request $request
     * @return array
     */
    public function anomoLoginAction(Anomo $anomo, Request $request)
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
     * @Route("/anomo/logout", name="anomo_logout", methods={"POST"})
     *
     * @param Anomo $anomo
     * @return array
     */
    public function anomoLogoutAction(Anomo $anomo)
    {
        return $anomo->post('userLogout');
    }

    /**
     * @Route("/anomo/{userID}", name="anomo_info", methods={"GET"})
     *
     * @param Anomo $anomo
     * @param int $userID
     * @return array
     */
    public function anomoInfoAction(Anomo $anomo, $userID)
    {
        return $anomo->get('user', [
            'userID' => $userID
        ]);
    }

    /**
     * @param array $values
     * @param array $required
     * @return array
     */
    protected function getRequired(array $values, array $required)
    {
        foreach($required as $name) {
            if (empty($values[$name])) {
                throw $this->createBadRequestException();
            }
        }

        return $values;
    }
}
