# WebWorks Tag Reading

This library allows WebWorks to handle tag reading in pure JavaScript. No extensions are required - tags are delivered through the Invocation Framework.

## Features

* Parse NDEF messages.
* Build NDEF messages.
* Logic to access fields of well known NDEF messages.
* Raw data access to break out content in fields of not so well known messages.

## Using

The following shows steps to use the library.

### config.xml

BlackBerry 10 delivers NDEF tag reads to applications via the Invocation Framework.

```
	<rim:invoke-target id="com.robwilliams.d20121122.ww.a">
		<type>APPLICATION</type>
		<filter>
			<action>bb.action.OPEN</action>
			<mime-type>application/vnd.rim.nfc.ndef</mime-type>
			<property value="ndef://1,ndef://2,ndef://4" var="uris" />
		</filter>
	</rim:invoke-target>
```

* `com.robwilliams.d2012112.ww.a` - this is an ID which must be unique. Please don't use `robwilliams` IDs.
* `application/vnd.rim.nfc.ndef` - this is the MIME type used internally to identify NDEF tags.
* `ndef://1,ndef://2,ndef://4` - this shows interest in `WELL KNOWN` (1), `MEDIA` (2) and `EXTERNAL` (4) tags.  
You can provide a finer filter here. Try `ndef://1/Sp` will limit to Smart Posters (Sp)  

### blackberrynfc.ndef.js


