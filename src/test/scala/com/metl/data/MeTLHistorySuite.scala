package com.metl.data

import org.scalatest._
import org.scalatest.FunSuite
import org.scalatest.BeforeAndAfter
import org.scalatest.matchers.{ShouldMatchers, HavePropertyMatcher, HavePropertyMatchResult}
import org.scalatest.prop.GeneratorDrivenPropertyChecks
import org.scalatest.OptionValues._

import net.liftweb.util.Helpers._
import net.liftweb.common._
import scala.xml._
import com.metl.data._
import Privacy._

class MeTLHistorySuite extends FunSuite with GeneratorDrivenPropertyChecks with BeforeAndAfter with ShouldMatchers with QueryXml with MeTLTextMatchers with MeTLDataGenerators {
	test("add an ink") {
    val h = new History("test")
		forAll (genInk) { (ink: MeTLInk) =>
      h.addStanza(ink)
      h.getInks == List(ink) || h.getHighlighters == List(ink)
    }
	}
	test("add a textbox") {
    val h = new History("test")
		forAll (genText) { (text: MeTLText) =>
      h.addStanza(text)
      h.getTexts == List(text)
    }
	}
	test("add an image") {
    val h = new History("test")
		forAll (genImage) { (image: MeTLImage) =>
      h.addStanza(image)
      h.getImages == List(image)
    }
	}
	test("add a submission") {
    val h = new History("test")
		forAll (genSubmission) { (sub: MeTLSubmission) =>
      h.addStanza(sub)
      h.getSubmissions == List(sub)
    }
	}
	test("add a command") {
    val h = new History("test")
		forAll (genCommand) { (comm: MeTLCommand) =>
      h.addStanza(comm)
      h.getCommands == List(comm)
    }
	}
	test("add an ink and then delete it") {
		forAll (genInk) { (ink: MeTLInk) =>
      val h = new History("test")
      val dirtyInk = ink.generateDirty()
      h.addStanza(ink)
      h.addStanza(dirtyInk)
      (h.getCanvasContents should not contain (ink))
      (h.getDeletedCanvasContents should contain (ink))
    }
	}
	test("add an ink and then delete it and then undelete it") {
		forAll (genInk) { (ink: MeTLInk) =>
      val h = new History("test")
      val dirtyInk = ink.generateDirty()
      h.addStanza(ink)
      h.addStanza(dirtyInk)
      (h.getCanvasContents should not contain (ink))
      (h.getDeletedCanvasContents should contain (ink))
      h.getDeletedCanvasContents.foreach((undeletedInk:MeTLCanvasContent) => {
        val newUndeletedInk = undeletedInk.generateNewIdentity(nextFuncName).adjustTimestamp(ink.timestamp + 2)
        val undeleteMarker = MeTLUndeletedCanvasContent(undeletedInk.server,undeletedInk.author,undeletedInk.timestamp + 1,undeletedInk.target,undeletedInk.privacy,undeletedInk.slide,nextFuncName,"ink",ink.identity,newUndeletedInk.identity)
        h.addStanza(newUndeletedInk)
        h.addStanza(undeleteMarker)
        (h.getCanvasContents should contain (newUndeletedInk))
        (h.getUndeletedCanvasContents should contain (undeleteMarker))
      })
    }
  }
	test("add an ink and then delete it with a moveDelta") {
		forAll (genInk) { (ink: MeTLInk) =>
      val h = new History("test")
      val moveDelta = MeTLMoveDelta(ink.server,ink.author,ink.timestamp + 1,ink.target,ink.privacy,ink.slide,nextFuncName,0.0,0.0,List(ink.identity),Nil,Nil,Nil,Nil,0.0,0.0,1.0,1.0,Privacy.NOT_SET,true)
      h.addStanza(ink)
      h.addStanza(moveDelta)
      (h.getCanvasContents should not contain (ink))
      (h.getDeletedCanvasContents should contain (ink))
    }
	}
	test("add an ink and then delete it with a moveDelta and then undelete it") {
		forAll (genInk) { (ink: MeTLInk) =>
      val h = new History("test")
      val moveDelta = MeTLMoveDelta(ink.server,ink.author,ink.timestamp + 1,ink.target,ink.privacy,ink.slide,nextFuncName,0.0,0.0,List(ink.identity),Nil,Nil,Nil,Nil,0.0,0.0,1.0,1.0,Privacy.NOT_SET,true)
      h.addStanza(ink)
      h.addStanza(moveDelta)
      (h.getCanvasContents should not contain (ink))
      (h.getDeletedCanvasContents should contain (ink))
      h.getDeletedCanvasContents.foreach((undeletedInk:MeTLCanvasContent) => {
        val newUndeletedInk = undeletedInk.generateNewIdentity(nextFuncName).adjustTimestamp(ink.timestamp + 2)
        val undeleteMarker = MeTLUndeletedCanvasContent(undeletedInk.server,undeletedInk.author,undeletedInk.timestamp + 1,undeletedInk.target,undeletedInk.privacy,undeletedInk.slide,nextFuncName,"ink",ink.identity,newUndeletedInk.identity)
        h.addStanza(newUndeletedInk)
        h.addStanza(undeleteMarker)
        (h.getCanvasContents should contain (newUndeletedInk))
        (h.getUndeletedCanvasContents should contain (undeleteMarker))
      })
    }
	}

}
