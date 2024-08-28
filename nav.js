import gsap from "gsap";
import Splitting from "splitting";
import Lenis from "lenis";
import {ScrollTrigger} from "gsap/ScrollTrigger";



export class Nav{
    constructor(container) {
        this.container = container;
        this.menuWrapper = document.querySelector('.menu-wrapper')
        this.navMenu = document.querySelector('.nav-menu')
        this.init()
    }

    init(){
        //gsap.set('.page-wrapper', {position: 'fixed'})
        //gsap.set('.header', {opacity: 0})
        this.initSplitting()
        this.initLenis()
        this.displayMenu()
    }


    initLenis(){

        this.lenis = new Lenis();

        this.lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
            this.lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);


        //this.lenis.stop();

    }





    initSplitting() {
        //Initialize Splitting, split the text into characters and get the results
        const targets = [...this.container.querySelectorAll("[split-text]")];

        const results = Splitting({target: targets, by: "chars"});


        //Get all the words and wrap each word in a span
        this.chars = results.map((result) => result.chars).flat();

        //Get all the characters and move them off the screen

        gsap.set([this.chars], {yPercent: 120});


        //init menu link hovers
        this.initMenuLinkHovers()


        if (targets.length !== 0) {
            targets.forEach((title) => {
                if (!title.hasAttribute("no-instance")) {
                    const chars = title.querySelectorAll(".char");
                    gsap.fromTo(
                        chars,
                        {
                            "will-change": "transform",
                            transformOrigin: "0% 50%",
                            yPercent: 120,
                        },
                        {
                            duration: 2,
                            ease: "expo.out",
                            yPercent: 0,
                            scrollTrigger: {
                                trigger: title,
                                invalidateOnRefresh: true,
                                start: "top 95%",
                                end: "bottom bottom",
                                //scrub: true,
                                //markers: true
                            },
                        }
                    );
                }
            });
        }
    }


}