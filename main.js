import barba from "@barba/core";
import gsap from "gsap";
import Lenis from "Lenis";
import {Global} from "./global.js";
import {Home} from "./home.js";
import {Internship} from "./internship.js";
import {Faq} from "./faq.js";
import {Community} from "./community.js";
import {NotFound} from "./404.js";
import {Legal} from "./legal.js";


gsap.config({
    nullTargetWarn: false,
});


function resetWebflow(data) {
    const parser = new DOMParser();
    const dom = parser.parseFromString(data.next.html, "text/html");
    const webflowPageId = dom.querySelector("html").getAttribute("data-wf-page");
    const siteId = dom.querySelector("html").getAttribute("data-wf-site");

    document.querySelector("html").setAttribute("data-wf-page", webflowPageId);
    if (window.Webflow) {
        window.Webflow.destroy();
        window.Webflow.ready();
        window.Webflow.require('commerce').init({ siteId: siteId });
        window.Webflow.require('ix2').init();
    }
}


barba.hooks.beforeLeave((data) => {
    // Kill ScrollTrigger instances
    ScrollTrigger.killAll()

    // Kill GSAP tweens
    gsap.getTweensOf(data.current.container.querySelectorAll('*')).forEach((tween) => {
        tween.revert();
        tween.kill();
    });

    ScrollTrigger.clearScrollMemory();
});




barba.hooks.enter((data) => {
    gsap.set([data.next.container, data.current.container], { position: "fixed", top: 0, left: 0, width: "100%", height:'100vh' });
});

barba.hooks.after((data) => {
    gsap.set(data.next.container, { position: "relative", height: "auto", clearProps: "all" });
    resetWebflow(data);
    ScrollTrigger.refresh();
});



let firstLoad = true;
let globalInstance;


barba.init({
    preventRunning: true,
    views: [
        {
            namespace: "home",
            afterEnter(data) {
                globalInstance = new Global(data.next.container);
                new Home(data.next.container, globalInstance);
                if (firstLoad && !sessionStorage.getItem("firstLoad")) {
                    // new Loader(data.next.container);
                    firstLoad = false;
                }else{
                    //new Home(data.next.container);
                }

                //setupLenis();
            }
        },
        {
            namespace: "faq",
            afterEnter(data) {
                globalInstance = new Global(data.next.container);
                new Faq(data.next.container);
                //setupLenis();
            },
        },
        {
            namespace: "contact",
            afterEnter(data) {
                globalInstance = new Global(data.next.container);
                //new Contact(data.next.container);
                //setupLenis();
            },
        },
        {
            namespace: "internship",
            afterEnter(data) {
                globalInstance = new Global(data.next.container);
                new Internship(data.next.container);
                //setupLenis();
            },
        },
        {
            namespace: "community",
            afterEnter(data) {
                globalInstance = new Global(data.next.container);
                new Community(data.next.container);
                //setupLenis();
            },
        },
        {
            namespace: "legal",
            afterEnter(data) {
                globalInstance = new Global(data.next.container);
                new Legal(data.next.container);
            },
        },
        {
            namespace: "404",
            afterEnter(data) {
                new NotFound(data.next.container);
            },
        }
    ],
    transitions: [
        {
            sync: true,
            enter(data) {
                const currentContainer = data.current.container;
                const nextContainer = data.next.container;


                let tlTransition = gsap.timeline({defaults: {ease: "expo.out", onComplete: () => {ScrollTrigger.refresh();}}});
                tlTransition.from(nextContainer, {
                    y: "110vh",
                    delay: 0.9,
                    duration: 0.8,
                    ease: "power2.out",
                });
                tlTransition.to(
                    currentContainer.querySelector('.overlay'),
                    {
                        opacity: 0,
                        duration: 0.3,
                        ease: "power1.out"
                    },
                    0
                );
                tlTransition.to(
                    currentContainer,
                    {
                        scale: 0.95,
                        duration: 0.3,
                        ease: "power1.out"
                    },
                    0
                );
                tlTransition.from(
                    nextContainer.querySelector('header'),
                    {
                        opacity: 0,
                        duration: 0.3,
                        ease: "power1.out"
                    },
                    ">"
                );
                return tlTransition;
            }
        }
    ]
});