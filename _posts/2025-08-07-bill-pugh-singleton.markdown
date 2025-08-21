Bill Pugh's singleton is a way to design a lazily loaded, thread-safe singleton in Java. In this post, I'll first cover the need for lazily loaded and thread-safe singletons and then see how this design pattern solves both of these cases elegantly. 

##Naive Implementation 1:

```
public class ExpensiveObject {
	private ExpensiveObject instance;
        public static ExpensiveObject getInstance() {
		if(instance == null) {
			instance = new ExpensiveObject();
		}
		return instance;
        }	

}
```
This implementation is non thread-safe due to two reasons:
1. Two threads calling the `getInstance()` method can have a race condition - Both might execute the check-then-act compound action concurrently (if instance is `null`, create a new instance). This might create multiple instances of the object in the JVM, violating the singleton invariant.

2. Even if there is no race condition, the code suffers from memory visibility problem due to Java's memory model. One thread might create an instance of `ExpensiveObject` and assign it to `instance`, but the other thread might not even see it.

A better implementation of this is perhaps to use sycnhronisation:

##Naive Implementation 2:

```
public class ExpensiveObject {
	private ExpensiveObject instance;
        public static ExpensiveObject getInstance() {
		if(instance == null) {
			instance = new ExpensiveObject();
		}
		return instance;
        }	

}
```
