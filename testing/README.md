- [Samples of testing on Angular](#samples-of-testing-on-angular)
  - [Isolated unit tests](#isolated-unit-tests)
  - [Interaction unit tests](#interaction-unit-tests)
  - [Integration tests](#integration-tests)
    - [Shallow tests](#shallow-tests)
    - [Deep integration tests](#deep-integration-tests)
    - [Integration tests of services using the HttpClient service](#integration-tests-of-services-using-the-httpclient-service)
    - [Triggering events on deep integration tests](#triggering-events-on-deep-integration-tests)
    - [Interacting with DOM](#interacting-with-dom)
    - [Testing components with other common dependencies](#testing-components-with-other-common-dependencies)
    - [Testing async calls](#testing-async-calls)

# Samples of testing on Angular

NOTE: It's customary with tests to write the spec file using the same exact name as the file to test, but replacing the word `.ts` by `.spec.ts` in the end of the name of the test file. And it's also customary to put it into the same directory. That way it's easy to see whether or not a piece of code has a test for it, and if not we can then write tests for it if we wish.

The following are the tools that are included in a default angular application (without needing of installing them manually) and that are usually used when testing it:

- Karma: the test runner, this is what actually executes our tests in a browser.
- Jasmine: it is the tool we use to create mocks, and it's the tool that we use to make sure that the tests work the way that we want them to using expectations.
- TestBed: is a class and the main testing tool provided by Angular for unit tests (specially for integration tests). This tool allows us to test both a component and its template running together.

The tests here uses these default tools.

**first-test.spec.ts**

This is just an example test file that shows the common layout and the core parts. Note that a test file not necessarily requires a corresponding file for the unit under test and without the 'spec' in the name.

## Isolated unit tests

**strength.pipe.spec.ts (multiple tests)**

This is an extremely simple piece of code:
- it has no dependencies,
- it doesn't have a constructor that receives any injected parameters,
- and it has only one simple one stateless method, the 'transform' method.

Note that this example is not using 'beforeEach' to initialize the pipe, we are following the "tell a story rule". This example shows that sometimes might be a pretty good idea to go ahead and move the initialization out of the 'beforeEach' and put it inside of the tests. We are going to be duplicating some code, but again, we're making it a little bit more obvious what's happening. This is fairly arguable just because this piece of code is so simple to construct, it doesn't take any dependencies, there's nothing complex going on in there, but I wouldn't think too much of if we had left this initialization call up in the 'beforeEach'.

**message.service.spec.ts (multiple tests)**

This is fairly simple piece of code:
- it has no constructor,
- it doesn't take in any dependencies,
- and it simply manages an array of messages.

Now this is case where we have our arrange inside of the 'beforeEach' (we initialize our 'MessageService' here, which lets us make sure that we've always got a brand new message service in each test), in which case we're kind of violating that "tell a story rule". The code would be hidden from us, but since it's such a simple line of code and the tests are fairly obvious in their description as to what's going on that it may not be such a big deal.

**heroes.component.spec.ts: should remove the indicated hero from the heroes list**

This component is relatively simple:
- it does have one dependency, the HeroService,
- and it does have a few methods, OnInit, getHeroes, add, and delete.

The test of this component shows an example of how mocking is necessary in order to isolate code. Note that HeroesComponent is expecting a HeroService in the constructor. We're writing a unit test so we don't want to provide the actual HeroService because in a unit test we don't want to use the real HeroService (even we don't want to make the HTTP call). Plus, since this is a unit test we don't want to test two units at the same time, we only want to test one. Therefore, we need to fake HeroService.

This is an example where Jasmine comes to the rescue, by helping us create a mock object using `jasmine.createSpyObj()`. This creates a mock object that we can control. We can tell it:
- what methods it has,
- what those methods should return when they're called,
- and we can ask it what methods were called in a test.

When we create a spy object with Jasmine, we do have to pass in an array of method names. If the object has no methods we leave it blank, but in this case, in our HeroesComponent we are using the 'addHero' method, the 'deleteHero' method, and the 'getHeroes' method.

Also note that when testing the 'delete' method, it's calling the 'deleteHero' method in the mocked service and then it's trying to subscribe to the result. Of course, the deleteHero method returns an observable, which we subscribe to, so we need our mock object to return an observable when 'deleteHero' is called (in this case, since we're just subscribing to that result and we don't care about the data, it doesn't really matter what that observable contains inside of itself). In order to totally satisfy the requirements of this test we have to tell the 'deleteHero' method that we want it to return an observable.

We return the observable by calling 'mockHeroService.deleteHero.and.returnValue'. The 'and' property is special because this a mock object created by Jasmine, and we can tell it to return the value that we pass into this method call here. We want an observable, and the simplest way to create an observable is to call the 'of' method from rxjs and pass in a Hero object.

## Interaction unit tests

**heroes.component.spec.ts: should call deleteHero**

Here we can see that sometimes we need to test that a method calls another methods in mocked dependencies. In this case we have to check that 'delete' calls 'heroService.deleteHero' because this is an important part of this component that actually persists the change that we've made on the server.

## Integration tests

Integration tests are special types of tests on Angular that let us test not only a component, but its template as well.

For integration testing, we use 'TestBed', which is the main testing tool provided by Angular that allows us to test both a component and its template running together.

### Shallow tests

**hero.component.spec.ts: should render hero name in an anchor tag**

This shows an example of how to test out templates, which is the core reason for writing integration tests. In this case we have a test that checks that the hero name shows up (is rendered) inside of an anchor tag.

'TestBed.configureTestingModule' allow us the creation of a module specifically for testing purposes (here we create a module that just has one component in it). 'TestBed.configureTestingModule' takes a single parameter that's an object, and that object matches exactly the layout of the object that receives the NgModule decorator (see [https://angular.io/api/core/NgModule](https://angular.io/api/core/NgModule) for details).

After the module is created, 'TestBed.createComponent' will allow us the creation of our component by passing in the type (HeroComponent in this case). Calling this function tells the TestBed to use the testing module that we already specified and to construct the HeroComponent.

The 'TestBed.createComponent' function, if you look at the signature, actually returns a ComponentFixture (specifically 'ComponentFixture\<HeroComponent\>'). A ComponentFixture is basically a wrapper for a component that's used in testing, and it has a few other properties, more than just what the component itself has. That is why we capture the returned value into a variable called 'fixture'.

'fixture.componentInstance' gets us a handle to the created instance of the component, the actual HeroComponent object.

The 'fixture.nativeElement' gets a handle to the DOM element that represents the container for the template. This is a standard HTML DOM element. This is the same API that you would use inside of plain old JavaScript if you were manipulating the DOM. For this case, we use 'querySelector' which can grab an element by its tag. So we want the anchor tag so we can just pass in the string 'a', and that will get us a handle to the anchor. Once we have that, there's another DOM property called 'textContent', which just takes all of the inner text and ignores the HTML and appends it all together, so everything inside of the anchor tag, which would be the hero id and then a space after the span, and then the hero name.

'fixture.debugElement' is like nativeElement, it has a way to access to root element of our template, but unlike the nativeElement, which is just exposing the underlying DOM API, the debugElement is more of a wrapper that has a different set of functionality that is very similar (Similar to the way that the fixture is a wrapper around a component, a debugElement is a wrapper around a DOM node). For this case we use the 'query' function along with a special library called By from '@angular/platform-browser'.

'By.css' is a function that takes in a CSS selector that probably, if you're familiar with JQuery and Sizzle selectors, you'll be fairly familiar with. If we want to get an element we just give it a string with a name of the tag like 'a'. But we could also select by class name using '.a', or by id with a pound sign like '#a'. If you're more familiar with JQuery than you are with the DOM API then this will feel a lot more comfortable to you.

NOTE: each DOM node has a wrapping debugElement node, and when we want to find a specific element we can either use the nativeElement and use things like the querySelector, or we can use the debugElement and use the query method. Ultimately they get to the same place.

Other scenarios where the debugElement comes in handy:
- it has a way to access directives.
- it allows to get a handle back to the component that this debugElement belongs to. In certain circumstances that could be useful as well. For example, when we're working with multiple components we need to know the component that a given element belongs to.

Note the HeroComponent gets its 'hero' as an input property. Since this HeroComponent isn't being run inside of another component that's going to set that 'hero' property, we set it ourselves manually using 'fixture.componentInstance.hero'.

Also note that the template of HeroComponent uses the 'routerLink' attribute in the \<a\> element (aka. anchor tag), and that 'routerLink' is part of the 'RouterModule', but we haven't brought in the 'RouterModule' inside of our 'TestBed'. This module created for testing purposes has no import, so it's just using the default Angular modules. It's not importing anything like the 'RouterModule', and that's where the 'routerLink' is. Now we can deal with this problem in a lot of ways, but here we deal with it using one of the most common ways to fix this kind of issues, the 'NO_ERRORS_SCHEMA' configuration.

The 'schemas' section in a module, just like 'declarations', is an array, and you can add in schemas that tell Angular how to process the HTML that it's been handled. Specifying 'NO_ERRORS_SCHEMA' in that section tells Angular "don't try to validate the schema". "Don't try to validate the template for the components that we use". Now there are some drawbacks to this. You don't get all of the schema validation you'd normally get in Angular, but this is a technique that we can use to fix the problem of having unknown elements of properties in the template under test.

Finally before to run the asserts, we have tell Angular to update the bindings. We have set the hero instance, the bindings are for example {{hero.id}} and {{hero.name}} in the template. Those do not get updated until change detection runs. So what we need to do is after we have set the hero property, we need to execute change detection and we do that by calling 'fixture.detectChanges'.

**heroes.component.spec.ts: should create one \<li\> for each hero**

This shows a more real example were can see here that this component actually has a child component, the app-hero component, which turns out is HeroComponent. Aditionally it takes in one dependency in the constructor that is HeroService. So, this component ultimately has two different collaborators that we've got to worry about and deal with, the HeroService and the child component of the hero component.

In Angular, when we have a service, we have to register it with our module. We do that in the module declaration in the providers section. Here in our test, we do need our HeroesComponent to have a service, but we don't want it to use the real HeroService because it makes HTTP calls, and we don't want to make any HTTP calls. Plus, we just don't want to be testing two units at the same time. We only want to test one unit at a time. Of course, when we want to draw a boundary around our unit tests, we use mocks. So we are going to create a mockHeroService.

NOTE: If we would like to test the component with the mocked service only ignoring the child component in the template, we can use NO_ERRORS_SCHEMA to avoid the issue.

NOTE: NO_ERRORS_SCHEMA has some side effects that may be undesirable in that it will hide any problems that are in our template. If we accidentally misspell one of our elements like 'buttons' instead of 'button' inside the template, Karma is not going to have a problem with this test because Angular doesn't have a problem with the 'button' element. Normally in Angular, the compiler, as it processes our HTML, will see incorrect elements and warn us about them. But if we have the NO_ERRORS_SCHEMA property set, we will not be getting that warning.

Note that we have to configure our testing module to handle the mocked service using the longhand method for adding providers. In the longhand method we have an object, that has a 'provide' property where we set that to 'HeroService', which says, "hey, when somebody asks for a HeroService, I'll tell you what to do". And in our case, we want to use a mock. So we add it in a second property, 'useValue'. With this method we can tell Angular use this object when somebody asks for 'HeroService' inside this testing module.

In order for the ngOnInit to fire, we have to run change detection. In Angular, change detection also causes lifecycle events to run. So we've told Angular to construct the component, but we have to fire change detection in order for the lifecycle event, which is the ngOnInit to fire. Of course, we could manually call ngOnInit ourselves, but that doesn't really follow with how we do integration tests. We want Angular to handle these things. And if we did call it for some reason when we were testing our template and we needed change detection to fire to do bindings, it would then call ngOnInit again, and we don't want that.

Finally look that we also added in the 'declarations' array a mock of the child component. To mock a child component we only have to declare a dummy class with the Component decorator and the corresponding selector. In this case we needed the 'app-hero' selector, that corresponds with the name of the element that the template of HeroesCompoent uses.

### Deep integration tests
 - how to deal with child components and directives, instead of ignoring them

**heroes.component.spec.ts: should render each hero using the child component HeroComponent**

The HeroesComponent is the perfect component for a deep integration test this because it has a child component, the app‑hero (implemented by HeroComponent), that is pretty simple.

Note here we sill mock the service but different to the case of the shallow test, we don't want to use a fake child component anymore because this is a deep test and we want to test the two components working together.

Also note that even when we use the two components, HeroComponent in its template utilizes the routerLink, that is why we need to use the NO_ERRORS_SCHEMA fix to silve the issue of using an unknown directive.

Same as shallow tests, in deep tests we need the components getting initialized calling 'fixture.detectChanges', which triggers the lifecycle events, which will cause the 'ngOnInit' function to fire.

NOTE: When you call change detection on the parent component, change detection will then run on all child components. So not only will the parent component get initialized, but all child components will get initialized as well.

Notice we're using 'By.directive' in the query. **In Angular a component is actually a subclass of a directive. It's a more specialized kind of directive**. We normally think of directives as being an attribute, such as 'routerLink', and components as being an element, such as \<app-hero\> is an element in the template of HeroesComponent, but **in the inner workings of Angular a directive is actually the parent class for both attribute directives and components**. That being said, using 'fixture.debugElement.queryAll' and 'By.directive' with HeroComponent as parameter will get a list of all of the debug elements that are attached to a HeroComponent. So this is going to get a list of every one of those app-hero elements that is ultimately created.

NOTE: In the rendered DOM does not exists an app-hero node, Angular is going to translate that out to the actual template of the HeroComponent (So we're going to get our anchor tag with a routerLink and we're going to get a button, all wrapped up inside of the app-hero node, it's going to basically explode it out into its actual template). 'By.directive' is getting a pointer to each of those app-hero nodes because those are the nodes that are attached to each HeroComponent.

### Integration tests of services using the HttpClient service

The HTTP interface is somewhat complex. And even though we could create a mock for the HTTP service, it can sometimes be a little bit difficult to do it correctly. With an integration test using TestBed, we can actually provide an special mock of the HTTP service that has already been provided by the Angular team and that gives us a lot of features when writing tests that checks HTTP calls.

**hero.service.spec.ts (multiple tests)**

This example shows how to tell Angular now to provide our mock HttpClient, and we do that by importing a module (HttpClientTestingModule from @angular/common/http/testing) in our testing module.

With our HttpClientTestingModule, we're not actually going to be issuing a real get request. We're going to have the HttpClientTestingModule intercept any HTTP call. And by intercepting a call and asking questions about what happened with the call, we can actually test what happens inside inside any method that make a HTTP request.

Note that there's one more thing we need to do. We need to get a handle to the mock HttpClient service so that we can adjust it and control it inside of our test. This is the HttpTestingController that is inside @angular/common/http/testing too.

Using the handle of type HttpTestingController we can tell to it to expect that, for example, a GET request to an specific URL is going to happen.

The flush method with for example 'httpTestingController.expectOne(...).flush' lets us decide what data to send back when the call is made.

The 'httpTestingController.verify' method checks that we're getting exactly the HTTP calls that we expect and no more.

The method property with for example 'httpTestingController.expectOne(...).request.method' let us to check the type of HTTP method used in the request to the specified URL.

NOTE: One thing that is important here is understanding how the HttpClient itself works. Calls like 'this.http.get' returns an observable, and we have to subscribe to that observable in order to make the HTTP request actually get fired. Otherwise, the call won't actually happen. So that's very important, one of those common things that you can miss and get wrong when using RxJS inside of Angular.

NOTE: even when you put expectations using the http client controller, Karma will be warning you, in the developer console of the browser, that it has no expectations. You could ignore this message or solve the problem including at least another expectation using Jasmine.

In this example we can see another utility method that is 'TestBed.inject'. This is a special method that basically accesses the dependency injection registry. So if I give it a type like HeroService, it's going to look inside of the dependency injection registry for the testing module that we've provided to TestBed and it will find the service that correlates to that type, and will give us a handle to it.

There is another way to get a handle to services used inside of a TestBed testing module, and that is through not the inject function on the TestBed, but instead the 'inject' helper function that exists in @angular/core/testing. Now that might sound confusing, so I created two examples of the same test using these two types of injects.

### Triggering events on deep integration tests

**heroes.component.spec.ts, triggering the custom event of the child component: should call 'delete' methhod when 'delete' button is clicked in HeroComponent (the child component) (raising the event in child component)**

This example shows how to trigger an event in the child component and how to spy the call of a method (using 'spyOn' from Jasmine) of the unit under test without having to mock the any of the statements inside it.

In this example, the event is 'delete', we can find it in the tamplate of HeroesComponent surrounded in parenthesis "(delete)=".

**heroes.component.spec.ts, triggering the click event in the button element of the child component: should call 'delete' methhod when 'delete' button is clicked in HeroComponent (the child component) (using click event in button element)**

This example is does the same test as the one above, but showing how to trigger the standard 'click' event in the button element of the chind component.

**heroes.component.spec.ts, raising (emitting) the event directly without triggering the standard events that exist on DOM elements: should call 'delete' methhod when 'delete' button is clicked in HeroComponent (the child component) (using emit)**

This example is does the same test as the one above, but showing how to raise the event from the EventEmitter object.

### Interacting with DOM

**heroes.component.spec.ts, interacting with the input box and triggering the click event: should add a new hero to the list when the 'add' button is clicked**

This example shows how we can insert text in a input box and trigger a click event too.

Note that in the assert section I use the 'textContent' property to get the text inside the ul element. This is the more easiest way to check if there is a text in the view because we dont't need to dig deeper and try to find if the corresponding elements of the child component was rendered. See [textContent in MDN](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) for details.

### Testing components with other common dependencies

**hero-detail.component.spec.ts: should render the hero name in a h2 tag**

This example shows how to test a component using ActivatedRoute from @angular/router and ngModel from FormsModule.

Note that tools like ActivatedRoute from @angular/router and Location from @angular/common can be easily mocked for testing purposes. This shows that many times the dependencies can be mocked without problems.

ngModel from FormsModule is a very special directive but solving this issue is easy, we only need to import the FormsModule in our testing module and that's it.

**heroes.component.spec.ts, mocking the routerLink directive: should bind the correct URL on routeLink directive**

This example shows how we can mock a directive and test values binded to it.

This example also shows how to use the 'host' property in the Directive decorator to map some binding in the host element (it is the element in the DOM where the directive is being used currently). The binding can be for properties, attributes, and events. In this example I mapped the 'click' event of the element to the invocation of the 'onClickHandler' method inside the directive.

### Testing async calls

**hero-detail.component.spec.ts (multiple tests)**

Here you can find four different tests for testing async operations:
- Using 'done' parameter from Jasmine .
- Using 'fakeAsync' and 'tick' from @angular/core/testing.
- Using 'fakeAsync' and 'flush' from @angular/core/testing.
- Using 'fakeAsync' for promises too.
- Using 'waitForAsync' from @angular/core/testing and 'fixture.whenStable' for promises.
