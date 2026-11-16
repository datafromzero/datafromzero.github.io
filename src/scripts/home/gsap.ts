// Single entry to GSAP for the homepage. Imported only from the deferred motion chunks, so the
// library never sits on the critical path. Plugins are registered by the modules that use them.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
// The mobile address bar resizing the viewport must not trigger a refresh while scrolling.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };
