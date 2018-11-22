<?php
namespace App\Controller\Api;

use App\Anomo\Anomo;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route(
 *     "/anomo",
 *     name="api_anomo_",
 *     options={"expose"=true}
 * )
 */
class AnomoController
{
    /**
     * @Route("/intents", name="intents", methods={"GET"})
     *
     * @param Anomo $anomo
     * @return array
     */
    public function intentsAction(Anomo $anomo)
    {
        return $anomo->get('anomoListIntent');
    }

    /**
     * @Route("/interest", name="interests", methods={"GET"})
     *
     * @param Anomo $anomo
     * @return array
     */
    public function interestAction(Anomo $anomo)
    {
        return $anomo->get('anomoListInterest');
    }
}
