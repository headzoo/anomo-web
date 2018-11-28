<?php
namespace App\Controller\Api;

use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route(
 *     "/anomo",
 *     name="api_anomo_",
 *     options={"expose"=true}
 * )
 */
class AnomoController extends Controller
{
    /**
     * @Route("/intents", name="intents", methods={"GET"})
     *
     * @return array
     */
    public function intentsAction()
    {
        return $this->anomo->get('anomoListIntent');
    }

    /**
     * @Route("/interest", name="interests", methods={"GET"})
     *
     * @return array
     */
    public function interestAction()
    {
        return $this->anomo->get('anomoListInterest');
    }
}
