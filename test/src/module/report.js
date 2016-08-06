import { assert }       from 'chai';

import ClassReport      from '../../../src/module/report/ClassReport';
import MethodReport     from '../../../src/module/report/MethodReport';
import ModuleReport     from '../../../src/module/report/ModuleReport';

import * as testconfig  from '../testconfig';

if (testconfig.modules['moduleReport'])
{
   suite('report:', () =>
   {
      suite('ModuleReport:', () =>
      {
         suite('instantiation:', () =>
         {
            let report;

            setup(() => { report = new ModuleReport(10, 100); });
            teardown(() => { report = undefined; });

            test('report has correct line start / end', () =>
            {
               assert.strictEqual(report.lineStart, 10);
               assert.strictEqual(report.lineEnd, 100);
            });
         });

         suite('addDependencies:', () =>
         {
            let report;

            setup(() => { report = new ModuleReport(10, 100); });
            teardown(() => { report = undefined; });

            test('report has correct dependencies', () =>
            {
               report.addDependencies({ type: 'esm' });

               assert.lengthOf(report.dependencies, 1);
            });
         });

         suite('createScope / popScope:', () =>
         {
            let report;

            setup(() => { report = new ModuleReport(10, 100); });
            teardown(() => { report = undefined; });

            test('report has correct class scope', () =>
            {
               assert.isUndefined(report.getCurrentClassReport());

               let classReport = report.createScope({ type: 'class', name: 'aclass', lineStart: 100, lineEnd: 200 });
               let classReport2 = report.getCurrentClassReport();

               assert.instanceOf(classReport, ClassReport);
               assert.instanceOf(classReport2, ClassReport);

               assert.lengthOf(report.classes, 1);

               assert.strictEqual(classReport, classReport2);

               classReport = report.popScope({ type: 'class' });
               classReport2 = report.getCurrentClassReport();

               assert.isUndefined(classReport);
               assert.isUndefined(classReport2);
            });

            test('report has correct method scope', () =>
            {
               assert.isUndefined(report.getCurrentMethodReport());

               let methodReport = report.createScope(
                { type: 'method', name: 'amethod', lineStart: 100, lineEnd: 200, paramCount: 0 });

               let methodReport2 = report.getCurrentMethodReport();

               assert.instanceOf(methodReport, MethodReport);
               assert.instanceOf(methodReport2, MethodReport);

               assert.lengthOf(report.methods, 1);

               assert.strictEqual(methodReport, methodReport2);

               methodReport = report.popScope({ type: 'method' });
               methodReport2 = report.getCurrentMethodReport();

               assert.isUndefined(methodReport);
               assert.isUndefined(methodReport2);
            });

            test('report has correct class w/ method scope', () =>
            {
               report.createScope({ type: 'class', name: 'aclass', lineStart: 100, lineEnd: 200 });
               report.createScope({ type: 'method', name: 'amethod', lineStart: 100, lineEnd: 200, paramCount: 4 });

               assert.lengthOf(report.classes, 1);
               assert.lengthOf(report.classes[0].methods, 1);

               assert.lengthOf(report.methods, 0);
            });

            test('error thrown for unknown scope type', () =>
            {
               assert.throws(() =>
               {
                  report.createScope({ type: 'unknown', name: '?', lineStart: 100, lineEnd: 200 });
               });

               assert.throws(() => { report.createScope(); });

               assert.throws(() => { report.createScope('unknown'); });

               assert.throws(() => { report.popScope(); });

               assert.throws(() => { report.popScope('unknown'); });
            });

            test('scope stacks are not defined', () =>
            {
               assert.isNotArray(report._scopeStackClass);
               assert.isNotArray(report._scopeStackMethod);
               report.finalize();
               assert.isNotArray(report._scopeStackClass);
               assert.isNotArray(report._scopeStackMethod);
            });

            test('class scope stack created / finalized', () =>
            {
               report.createScope({ type: 'class', name: 'aclass', lineStart: 100, lineEnd: 200 });

               assert.isArray(report._scopeStackClass);
               assert.isNotArray(report._scopeStackMethod);

               report.finalize();

               assert.isNotArray(report._scopeStackClass);
               assert.isNotArray(report._scopeStackMethod);
            });

            test('method scope stack created / finalized', () =>
            {
               report.createScope({ type: 'method', name: 'amethod', lineStart: 100, lineEnd: 200, paramCount: 4 });

               assert.isNotArray(report._scopeStackClass);
               assert.isArray(report._scopeStackMethod);

               report.finalize();

               assert.isNotArray(report._scopeStackClass);
               assert.isNotArray(report._scopeStackMethod);
            });
         });

         suite('halsteadItemEncountered:', () =>
         {
            let report;

            setup(() => { report = new ModuleReport(10, 100); });
            teardown(() => { report = undefined; });

            test('report has correct class w/ method halstead metrics', () =>
            {
               report.createScope({ type: 'class', name: 'aclass', lineStart: 100, lineEnd: 200 });
               report.createScope({ type: 'method', name: 'amethod', lineStart: 100, lineEnd: 200, paramCount: 0 });

               report.halsteadItemEncountered('operators', 'test');

               assert.strictEqual(report.methodAggregate.halstead.operators.identifiers[0], 'test');
               assert.strictEqual(report.classes[0].methodAggregate.halstead.operators.identifiers[0], 'test');
               assert.strictEqual(report.classes[0].methods[0].halstead.operators.identifiers[0], 'test');
            });
         });

         suite('incrementCyclomatic:', () =>
         {
            let report;

            setup(() => { report = new ModuleReport(10, 100); });
            teardown(() => { report = undefined; });

            test('report has correct class w/ method cyclomatic metrics', () =>
            {
               report.createScope({ type: 'class', name: 'aclass', lineStart: 100, lineEnd: 200 });
               report.createScope({ type: 'method', name: 'amethod', lineStart: 100, lineEnd: 200, paramCount: 0 });

               report.incrementCyclomatic(50);

               assert.strictEqual(report.methodAggregate.cyclomatic, 51);
               assert.strictEqual(report.classes[0].methodAggregate.cyclomatic, 51);
               assert.strictEqual(report.classes[0].methods[0].cyclomatic, 51);
            });
         });

         suite('incrementLogicalSloc:', () =>
         {
            let report;

            setup(() => { report = new ModuleReport(10, 100); });
            teardown(() => { report = undefined; });

            test('report has correct class w/ method sloc metrics', () =>
            {
               report.createScope({ type: 'class', name: 'aclass', lineStart: 100, lineEnd: 200 });
               report.createScope({ type: 'method', name: 'amethod', lineStart: 100, lineEnd: 200, paramCount: 0 });

               report.incrementLogicalSloc(50);

               assert.strictEqual(report.methodAggregate.sloc.logical, 50);
               assert.strictEqual(report.classes[0].methodAggregate.sloc.logical, 50);
               assert.strictEqual(report.classes[0].methods[0].sloc.logical, 50);
            });
         });
      });

      suite('AbstractReport:', () =>
      {
         let report;

         setup(() => { report = new ModuleReport(10, 100); });
         teardown(() => { report = undefined; });

         test('report methodAggregate has correct params count', () =>
         {
            report.incrementParams(20);
            assert.strictEqual(report.methodAggregate.params, 20);
         });
      });

      suite('HalsteadData:', () =>
      {
         let report;

         setup(() => { report = new ModuleReport(10, 100); });
         teardown(() => { report = undefined; });

         test('report methodAggregate halstead data is reset', () =>
         {
            report.methodAggregate.halstead.bugs = 1000;
            report.methodAggregate.halstead.operands.distinct = 1000;
            report.methodAggregate.halstead.operands.identifiers.push('test');
            report.methodAggregate.halstead.reset(true);
            assert.strictEqual(report.methodAggregate.halstead.bugs, 0);
            assert.strictEqual(report.methodAggregate.halstead.operands.distinct, 0);
            assert.lengthOf(report.methodAggregate.halstead.operands.identifiers, 0);
         });
      });
   });
}