import { TapBark } from "tap-bark";
// tslint:disable-next-line:ordered-imports
import { TestSet, TestRunner } from "alsatian";

(async () =>
{
    const testSet = TestSet.create();
    testSet.addTestsFromFiles('./test/**/*.ts');

    const testRunner = new TestRunner();

    testRunner.outputStream
        .pipe(TapBark.create().getPipeable())
        .pipe(process.stdout);

    await testRunner.run(testSet);
})().catch(e =>
{
    // tslint:disable-next-line:no-console
    console.error(e);
    process.exit(1);
});