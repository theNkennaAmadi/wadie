import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export class Faq{
    constructor(container) {
        this.container = container
        this.init()
    }
    init(){
        this.initFAQ()
    }

    initFAQ() {
        const faqs = [...this.container.querySelectorAll(".sp-faq-content")];
        const ans = [...this.container.querySelectorAll(".sp-faq-answer")];
        const accordion = [...this.container.querySelectorAll(".accordion-vertical")];

        let tl1 = gsap.timeline();
        faqs.map((faq) => {
            let tlHover = gsap.timeline({paused: true});
            tlHover.to(faq.querySelector('.sp-inner-line'), {width: '100%', duration: 1, ease: 'expo.out'})

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

        gsap.from('.sp-outer-line', {
            width: 0, duration: 1.5, ease: 'expo.out',
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