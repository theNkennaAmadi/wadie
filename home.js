import {gsap} from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import Odometer from "odometer";
import "odometer/themes/odometer-theme-default.css";


gsap.registerPlugin(ScrollTrigger, Flip)

export class Home{
    constructor(container, globalInstance) {
        window.scrollTo(0, 0);
        this.container = container;
        this.lenis = globalInstance.lenis
        this.loaderVideo = this.container.querySelector('.loader-video')
        this.courseLinks = [...this.container.querySelectorAll('.course-lesson-link')]
        this.init()
    }

    init(){
        gsap.set('.page-wrapper', {position: 'fixed'})
        gsap.set('.header', {opacity: 0})
        this.odometer()
        this.initReveal()
        this.showCourses()
        this.setUpLoop()
        this.setUpLessons()
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

        this.aboutVideoWrapper = this.container.querySelector('.about-video-wrapper')
        this.academyVisualContainer = this.container.querySelector('.about-visual-content')
        let state = Flip.getState(this.aboutVideoWrapper);
        this.academyVisualContainer.appendChild(this.aboutVideoWrapper);
        Flip.to(state, {
            scrollTrigger: {
                trigger: ".academy-grid",
                start: "top 90%",
                end: "top 30%",
                scrub: 1,
                onUpdate: (self)=>{
                    const progress = 100-(self.progress * 100);
                    gsap.to('.academy-video', {clipPath: `inset(0% 0% ${progress}% 0%)`, duration: 1})
                }
            },
            scale: true,
            absolute: true,
        });

    }

    revealVideo(){
        console.log(this.lenis)
        this.lenis.stop()


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
            .to('.loader-video', {opacity: 1, duration: 0.5}, "<")
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
        //.set(document.querySelector('.intro-header').querySelectorAll('.char-wrap'), {overflow: 'visible', duration: 0.5}, "<0.5")
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

    setUpLoop(){
        const loop = horizontalLoop(document.querySelectorAll('.partners-list-item'), {
            paused: false,
            repeat: -1,
            speed: 0.85,
        });
    }

    setUpLessons(){
        this.lessonsChars = this.container.querySelector('.lessons-main-wrapper').querySelectorAll('.char')
        this.lessonsChars && gsap.set(this.lessonsChars, {yPercent: 0})

        this.lessons = [...this.container.querySelectorAll('.lessons-item')];
        this.lessonsVisuals = [...this.container.querySelectorAll('.lessons-visuals-item')]
        this.lessons.forEach((link, index) => {
            const linkText = link.querySelectorAll('.char')
            const inactiveVisuals = this.lessonsVisuals.filter((item, indexN) => indexN !== index)
            const tllink = gsap.timeline({paused: true});
            tllink.to(linkText, {yPercent: -100, duration: 0.75, ease: 'power4.out', stagger: {amount: 0.2}})
            //let tlVisual = gsap.timeline({paused: true})
            // tlVisual.to(inactiveVisuals, {opacity: 0, duration: 0.5})
            // tlVisual.to(this.lessonsVisuals[index], {opacity: 1, duration: 0.5}, ">")

            link.addEventListener('mouseover', () => {
                tllink.timeScale(1)
                tllink.play()
                this.lessonsVisuals[index].classList.add('active')
            });

            link.addEventListener('mouseout', () => {
                tllink.timeScale(1.5)
                tllink.reverse()
                this.lessonsVisuals[index].classList.remove('active')
            });

        });
    }
}


function horizontalLoop(items, config) {
    items = gsap.utils.toArray(items);
    config = config || {};
    let tl = gsap.timeline({repeat: config.repeat, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
        length = items.length,
        startX = items[0].offsetLeft,
        times = [],
        widths = [],
        xPercents = [],
        curIndex = 0,
        pixelsPerSecond = (config.speed || 1) * 100,
        snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
        totalWidth, curX, distanceToStart, distanceToLoop, item, i;
    gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
        xPercent: (i, el) => {
            let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
            xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"));
            return xPercents[i];
        }
    });
    gsap.set(items, {x: 0});
    totalWidth = items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0);
    for (i = 0; i < length; i++) {
        item = items[i];
        curX = xPercents[i] / 100 * widths[i];
        distanceToStart = item.offsetLeft + curX - startX;
        distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
        tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
            .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
            .add("label" + i, distanceToStart / pixelsPerSecond);
        times[i] = distanceToStart / pixelsPerSecond;
    }
    function toIndex(index, vars) {
        vars = vars || {};
        (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
        let newIndex = gsap.utils.wrap(0, length, index),
            time = times[newIndex];
        if (time > tl.time() !== index > curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
            vars.modifiers = {time: gsap.utils.wrap(0, tl.duration())};
            time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        curIndex = newIndex;
        vars.overwrite = true;
        return tl.tweenTo(time, vars);
    }
    tl.next = vars => toIndex(curIndex+1, vars);
    tl.previous = vars => toIndex(curIndex-1, vars);
    tl.current = () => curIndex;
    tl.toIndex = (index, vars) => toIndex(index, vars);
    tl.times = times;
    tl.progress(1, true).progress(0, true); // pre-render for performance
    if (config.reversed) {
        tl.vars.onReverseComplete();
        tl.reverse();
    }
    return tl;
}
