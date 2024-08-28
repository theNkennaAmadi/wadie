import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {ScrollToPlugin} from "gsap/ScrollToPlugin";
import Lenis from "lenis";
import Splitting from "splitting";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export class Global{
    constructor(container) {
        this.container = container;
        this.menuWrapper = document.querySelector('.menu-wrapper')
        this.navMenu = document.querySelector('.nav-menu')
        this.init()
    }

    init(){
        //gsap.set('.page-wrapper', {position: 'fixed'})
        //gsap.set('.header', {opacity: 0})
        this.initLenis()
        this.initSplitting()
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

        window.setTimeout(()=>{
            this.checkAnchorOnLoad();
        }, 3200)

    }

    initSplitting() {
        //Initialize Splitting, split the text into characters and get the results
        const targets = [...document.querySelectorAll("[split-text]")];

        const results = Splitting({target: targets, by: "chars"});

        const targets2 = [...document.querySelectorAll("[split-loader]")];
        if(targets2.length !== 0){
            const results2 = Splitting({target: targets2, by: "chars"});
        }

        //Get all the words and wrap each word in a span
        this.chars = results.map((result) => result.chars).flat();

        //Get all the characters and move them off the screen

        gsap.set([this.chars], {yPercent: 120});

        gsap.to(this.container.querySelector('.main'), {opacity: 1})


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

    displayMenu(){
        this.menuChars = this.menuWrapper.querySelectorAll('.char')
        gsap.set(this.menuChars, {yPercent: 120})


        this.menuOpen = false
        this.menuTL = gsap.timeline({paused: true})
        /*
        this.menuTL.set(this.menuWrapper, {display: 'block'})
            .to(this.menuWrapperBg, {xPercent:20, yPercent:-20, duration: 0.7})
            .to(this.menuWrapperBg, {width: '200vmax', height: '200vmax', duration: 1}, "<0.25")
            .to(this.menuWrapper.querySelectorAll('.char'), {yPercent: 0, duration: 0.5}, "<0.5")

         */
        this.menuTL.set(this.menuWrapper, {display: 'block'})
            .set('.header', {backgroundColor: '#838bc5', duration: 0.7, ease: 'expo.out'})
            .to(this.menuWrapper, {clipPath:"inset(0% 0% 0% 0%)", duration: 0.7, ease: 'expo.out'}, "<")
            .to(this.menuWrapper.querySelectorAll('.char'), {yPercent: 0, duration: 0.5}, "<0.5")

        this.navMenu.addEventListener('click', ()=>{
            this.menuOpen ? this.menuTL.reverse() : this.menuTL.play()
            this.menuOpen ? this.lenis.start() : this.lenis.stop()
            this.menuOpen ? gsap.set('.menu-grid-link-blocks', {pointerEvents: 'none'}) : gsap.set('.menu-grid-link-blocks', {pointerEvents: 'all'})
            this.menuOpen = !this.menuOpen
        })
    }

    initMenuLinkHovers(){
        this.menuLinks = document.querySelectorAll('.menu-link');
        this.menuLinks.forEach(link => {
            const linkText = link.querySelectorAll('.char')
            const tllink = gsap.timeline({paused: true});
            tllink.fromTo(linkText,{yPercent: 0}, {yPercent: -100, duration: 0.75, ease: 'power4.out', stagger: {amount: 0.2}});
            link.addEventListener('mouseover', () => {
                tllink.timeScale(1)
                tllink.play()
            });

            link.addEventListener('mouseout', () => {
                tllink.timeScale(1.5)
                tllink.reverse()
            });
            link.addEventListener('click', ()=>{
                this.navMenu.click()
            })
        });

    }

    checkAnchorOnLoad() {
        if (window.location.hash) {
            const sectionId = window.location.hash.substring(1);
            console.log(sectionId)
            gsap.to(window, {
                scrollTo: document.getElementById(sectionId).getBoundingClientRect().top - 64,
                duration: 2,
                ease: "power2.out"
            })
        }
    }

}