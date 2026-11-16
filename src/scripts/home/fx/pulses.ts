// 02: once the branches have drawn, a small light travels from the root down each path to its career (MotionPath).
// It runs only while the tree is on screen and fully drawn, so it costs nothing the rest of the time.
import { gsap, ScrollTrigger } from '../gsap';
import { afterNextFrame } from '../yield';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

const NS = 'http://www.w3.org/2000/svg';

interface Tree {
	section: HTMLElement;
	svg: SVGSVGElement;
	trunk: SVGPathElement;
	branches: SVGPathElement[];
	/** The scrubbed build timeline, and the time on it at which every branch has finished drawing. */
	tl: gsap.core.Timeline;
	drawnAt: number;
}

/** One light: a soft halo and a core, moved together as a group along a path. */
function light(): SVGGElement {
	const g = document.createElementNS(NS, 'g');
	g.setAttribute('class', 'pulse');
	for (const [r, o] of [
		[15, 0.14],
		[5, 1],
	] as const) {
		const c = document.createElementNS(NS, 'circle');
		c.setAttribute('r', String(r));
		c.setAttribute('fill-opacity', String(o));
		g.append(c);
	}
	return g;
}

export function init({ section, svg, trunk, branches, tl, drawnAt }: Tree): () => void {
	const group = document.createElementNS(NS, 'g');
	group.setAttribute('class', 'pulses');
	group.setAttribute('aria-hidden', 'true');
	svg.append(group);
	gsap.set(group, { opacity: 0 });

	// One small timeline per light. MotionPath measures a path the first time it renders, which costs a few
	// milliseconds each: they are warmed up one per frame slot, then joined into the loop.
	const travel = (path: SVGPathElement, duration: number, ease: string) => {
		const g = light();
		group.append(g);
		gsap.set(g, { opacity: 0 });
		return gsap
			.timeline({ paused: true })
			.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' }, 0)
			.to(g, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] }, duration, ease }, 0)
			.fromTo(g, { opacity: 1 }, { opacity: 0, duration: 0.35, ease: 'power1.in', immediateRender: false }, duration - 0.35);
	};
	// down the trunk (the data goes in), then it fans out to the five careers
	const lights = [travel(trunk, 0.9, 'power2.in'), ...branches.map((b) => travel(b, 2.2, 'power2.inOut'))];

	let loop: gsap.core.Timeline | undefined;
	let visible = false;
	let drawn = false;
	let dead = false;
	const sync = () => {
		const on = visible && drawn && !!loop;
		gsap.to(group, { opacity: on ? 1 : 0, duration: 0.6, ease: 'power1.out', overwrite: true });
		if (on) loop?.play();
		else loop?.pause();
	};
	void (async () => {
		for (const t of lights) {
			await afterNextFrame();
			if (dead) return;
			t.progress(1, true).progress(0, true);
		}
		await afterNextFrame();
		if (dead) return;
		loop = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.8 });
		lights.forEach((t, i) => loop?.add(t.paused(false), i === 0 ? 0 : 0.9 + (i - 1) * 0.07));
		sync();
	})();

	const watch = ScrollTrigger.create({
		trigger: section,
		start: 'top bottom',
		end: 'bottom top',
		onToggle: (self) => {
			visible = self.isActive;
			sync();
		},
	});
	const onUpdate = () => {
		const d = tl.time() >= drawnAt;
		if (d !== drawn) {
			drawn = d;
			sync();
		}
	};
	tl.eventCallback('onUpdate', onUpdate);

	return () => {
		dead = true;
		tl.eventCallback('onUpdate', null);
		watch.kill();
		loop?.kill();
		lights.forEach((t) => t.kill());
		gsap.killTweensOf(group);
		group.remove();
	};
}
