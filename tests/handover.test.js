import test from 'node:test';import assert from 'node:assert/strict';
import {seedStudies} from '../shared/core.js';
import {handoverData,handoverText} from '../shared/handover.js';

test('handover keeps unknown examination and missing timing visible',()=>{const s=seedStudies()[0],data=handoverData(s),text=handoverText(s);assert.ok(data.missing.includes('Injury timing'));assert.ok(data.missing.includes('Open wound assessment'));assert.match(text,/No image inference, diagnosis, urgency or referral decision/);assert.doesNotMatch(text,/Open wound: absent/)});
test('marked concerns remain separate from image result',()=>{const s=seedStudies()[0];s.examination.open_wound='present';s.examination.perfusion='present';s.injury_timing='same day';const data=handoverData(s);assert.ok(data.warnings.some(w=>w.includes('Open wound concern')));assert.ok(data.warnings.some(w=>w.includes('Perfusion concern')));assert.equal(data.missing.includes('Injury timing'),false)});
test('incomplete views and side conflict are explicit',()=>{const s=seedStudies()[2],data=handoverData(s);assert.deepEqual(data.missingViews,['lateral']);assert.ok(data.warnings.some(w=>w.includes('Laterality')))});
