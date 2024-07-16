import {gsap} from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import Splitting from "splitting";
import Lenis from 'lenis';
import Odometer from "odometer";
import "odometer/themes/odometer-theme-default.css";


gsap.registerPlugin(ScrollTrigger, Flip)

class Home{
    constructor() {
        window.scrollTo(0, 0);
        this.menuWrapper = document.querySelector('.menu-wrapper')
        this.menuWrapperBg = document.querySelector('.menu-wrapper-bg')
        this.navMenu = document.querySelector('.nav-menu')
        this.loaderVideo = document.querySelector('.loader-video')
        this.loaderM = document.querySelector('.loader-m')
        this.courseLinks = [...document.querySelectorAll('.course-lesson-link')]
        this.init()
    }

    init(){
        gsap.set('.page-wrapper', {position: 'fixed'})
        gsap.set('.header', {opacity: 0})
        this.initLenis()
        this.initSplitting()
        this.odometer()
        this.displayMenu()
        this.initReveal()
        this.showCourses()
        this.initFAQ()
        this.lenis.on('scroll', (e) => {
            if (e.target.scrollTop === 0) {
                window.scrollTo(0, 0);
            }
        });
    }

    initLenis(){

        this.lenis = new Lenis();

        this.lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
            this.lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);


        this.lenis.stop();

    }

    initFlip(){
        //const state = Flip.getState(this.loaderM);
        //document.querySelector('.intro-video').appendChild(this.loaderM)
        Flip.fit(this.loaderVideo, document.querySelector('.intro-video'), {
            duration: 1,
            ease: "power1.inOut",
            simple: true,
            willChange: "transform",
            onComplete: ()=>{
                gsap.set('.page-wrapper', {position: 'relative'})
                gsap.set('.trailer-wrapper', {display:'none'})
                document.querySelector('.intro-video').appendChild(this.loaderVideo)
                gsap.set(this.loaderVideo, {y: 0, x:0, width: '100%', height: '100%'})
                this.initFirstLoad()
                this.lenis.start()
                gsap.to('.trailer-text-wrapper', {clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1, ease: 'expo.out'})
            }
        });
    }

    revealVideo(){
        this.lenis.stop()
        /*
        Flip.fit(this.loaderVideo, document.querySelector('.trailer-container'), {
            duration: 1,
            ease: "power1.inOut",
            simple: true,
            willChange: "transform",
            onComplete: ()=>{
                document.querySelector('.trailer-container').appendChild(this.loaderVideo)
                gsap.set(this.loaderVideo, {y: 0, x:0, width: '100%', height: '100%'})
                gsap.to('.trailer-text-wrapper', {clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', duration: 1, ease: 'expo.out'})
                this.loaderVideo.querySelector('video').muted =false
                this.loaderVideo.querySelector('video').play()
            }
        });

         */

        let state = Flip.getState(this.loaderVideo);
        document.querySelector('.trailer-container').appendChild(this.loaderVideo)
        Flip.from(state, {
            duration: 1,
            ease: "power1.inOut",
            simple: true,
            willChange: "transform",
            onComplete: ()=>{
                gsap.set(this.loaderVideo, {y: 0, x:0, width: '100%', height: '100%'})
                gsap.to('.trailer-text-wrapper', {clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', duration: 1, ease: 'expo.out'})
                this.loaderVideo.querySelector('video').muted =false
                this.loaderVideo.querySelector('video').play()
            }
        });
    }

    initReveal(){
        document.querySelector('.trailer-text-wrapper').addEventListener('click', ()=>{
            gsap.set('.trailer-wrapper', {display: 'flex', onComplete: ()=>{
                    this.revealVideo()
                }})
        })
        document.querySelector('.trailer-exit-link').addEventListener('click', ()=>{
            this.initFlip();
            this.loaderVideo.querySelector('video').muted = true
        })
    }

    initSplitting() {
        //Initialize Splitting, split the text into characters and get the results
        const targets = [...document.querySelectorAll("[split-text]")];
        console.log(targets)
        const results = Splitting({target: targets, by: "chars"});

        const targets2 = [...document.querySelectorAll("[split-loader]")];
        const results2 = Splitting({target: targets2, by: "chars"});

        //Get all the words and wrap each word in a span
        this.chars = results.map((result) => result.chars).flat();
        console.log(this.chars)
        this.chars.forEach((word) => {
            let wrapper = document.createElement("span");
            wrapper.classList.add("char-wrap");
            word.parentNode.insertBefore(wrapper, word);
            wrapper.appendChild(word);
        });

        //Get all the characters and move them off the screen

        gsap.set([this.chars], {yPercent: 120});

        const w = document.querySelector("[data-word='Through']").querySelectorAll('.char')


        //gsap.to(document.querySelector("[data-word='Through']").querySelectorAll('.char'), {yPercent: -30})

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

    odometer() {
        window.odometerOptions = {
            duration: 15000, // Change how long the javascript expects the CSS animation to take
        };
        let odometer = new Odometer({
            // el tells the odometer script which element should be the odometer
            el: document.querySelector(".odometer"),
            // value tells the odometer script what the start value should be
            value: 0,
            // Change how digit groups are formatted, and how many digits
            // are shown after the decimal point
            // Change how long the javascript expects the CSS animation to take
        });
        odometer.render(0);
        odometer.update(100);
        const odTL = gsap.timeline({delay:1.2});
        odTL.from('.loader-video', {
            y: '100vh',
            scale: 0.6,
            duration: 1.5,
            ease: 'power2.inOut',
            onComplete: () => this.initFlip()
        })
            .to(document.querySelector('.loader-statement').querySelectorAll('.char'), {
                y: (i, el) => gsap.utils.random(-50, 50),
                x: (i, el) => gsap.utils.random(-50, 50),
                rotation: (i, el) => gsap.utils.random(-90, 90),
                scale: gsap.utils.random(0.8, 1.2),
                duration: 0.5,
                stagger:{
                    amount: 0.2,
                    from: 'end',
                },
                ease: 'power2.out'
            }, '<0.8')

            .to('.loader-statement', {
                y: '-70vh',
                duration: 1,
            }, "<")
            .to('.preloader-loading', {y: '100vh'}, '<')
            .to('.preloader-wrapper-bg', {opacity: 0, duration: 1})
            .set('.preloader-wrapper', {display: 'none'})

    }

    initFirstLoad(){
        let tlFirst = gsap.timeline()
        tlFirst.to(document.querySelector('.intro-grid-wrapper').querySelectorAll('.char'), {yPercent: 0, duration: 1})
            .to('.header', {opacity: 1, duration: 1}, "<")
            .set(document.querySelector('.intro-header').querySelectorAll('.char-wrap'), {overflow: 'visible', duration: 0.5}, "<0.5")
    }

    displayMenu(){
        this.menuChars = this.menuWrapper.querySelectorAll('.char')
        gsap.set(this.menuChars, {yPercent: 120})


        this.menuOpen = false
        this.menuTL = gsap.timeline({paused: true})
        this.menuTL.set(this.menuWrapper, {display: 'block'})
            .to(this.menuWrapperBg, {xPercent:20, yPercent:-20, duration: 0.7})
            .to(this.menuWrapperBg, {width: '200vmax', height: '200vmax', duration: 1}, "<0.25")
            .to(this.menuWrapper.querySelectorAll('.char'), {yPercent: 0, duration: 0.5}, "<0.5")

        this.navMenu.addEventListener('click', ()=>{
            this.menuOpen ? this.menuTL.reverse() : this.menuTL.play()
           this.menuOpen ? this.lenis.start() : this.lenis.stop()
            this.menuOpen = !this.menuOpen
        })
    }

    initMenuLinkHovers(){
        this.menuLinks = document.querySelectorAll('.menu-link');
        this.menuLinks.forEach(link => {
            const linkText = link.querySelectorAll('.char')
            const tllink = gsap.timeline({paused: true});
            tllink.to(linkText, {yPercent: -100, duration: 0.75, ease: 'power4.out', stagger: {amount: 0.2}});
            link.addEventListener('mouseover', () => {
                tllink.timeScale(1)
                tllink.play()
            });

            link.addEventListener('mouseout', () => {
                tllink.timeScale(1.5)
                tllink.reverse()
            });
        });

    }

    showCourses(){
        this.courseLinks.forEach((link, index) => {
            link.addEventListener('click', ()=>{
                this.modalName = link.getAttribute('data-course')
                this.tlCourse = gsap.timeline()
                this.tlCourse.to('.course-content-main-wrapper', {display: 'flex'})
                    .to('.course-content-block', {x: '0rem', duration: 1, ease: 'expo.out'})
                    .to(document.querySelector(`[data-modal="${CSS.escape(this.modalName)}"]`), {display: 'grid', opacity: 1, duration: 1, ease: 'expo.out'}, "<")
            })
        })
        document.querySelector('.course-back-btn').addEventListener('click', ()=>{
            this.tlCourse.reverse()
        })
    }

    initFAQ(){
        const faqs = [...document.querySelectorAll(".sp-faq-content")];
        const ans = [...document.querySelectorAll(".sp-faq-answer")];
        const accordion = [...document.querySelectorAll(".accordion-vertical")];

        let tl1 = gsap.timeline();
        faqs.map((faq) => {
            let tlHover = gsap.timeline({paused: true});
            tlHover.to(faq.querySelector('.sp-inner-line'), {width: '100%', duration: 1, ease: 'expo.out' })

            faq.addEventListener("click", (e) => {
                let answer = faq.querySelector(".sp-faq-answer");
                let accord = faq.querySelector(".accordion-vertical");
                if (!faq.classList.contains("active")) {
                    tl1.to(answer, {
                        height: "auto"
                    });
                    tl1.to(
                        accord,
                        {
                            scaleY: 0
                        },
                        "<"
                    );
                    faq.classList.add("active");
                } else {
                    tl1.to(answer, {
                        height: 0
                    });
                    tl1.to(
                        accord,
                        {
                            scaleY: 1
                        },
                        "<"
                    );
                    faq.classList.remove("active");
                }
            });

            faq.addEventListener("mouseover", (e) => {
                tlHover.timeScale(1)
                tlHover.play()
            });
            faq.addEventListener("mouseout", (e) => {
                tlHover.timeScale(2)
                tlHover.reverse()
            });
        });

        gsap.from('.sp-outer-line', {width: 0, duration: 1.5, ease: 'expo.out',
            stagger: {
                amount: 0.5
            },
            scrollTrigger: {
                trigger: '.faq-cc-list',
                start: 'top 70%',
            }
        })

    }
}

new Home()


