package controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController {

    // Uncomment for local REST calls as desired

//    @RequestMapping(value="/",method = RequestMethod.GET)
//    public String homepage(){
//        return "index";
//    }
//
//    @RequestMapping(value="/resource/",method = RequestMethod.GET)
//    public String resource(){
//        return "{\"resource\": \"resource\"}";
//    }
}
